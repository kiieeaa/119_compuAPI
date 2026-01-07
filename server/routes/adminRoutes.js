const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Wajib import ini buat regenerate
const Product = require('../models/Product');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const Log = require('../models/Log');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Middleware Khusus Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: "Akses ditolak. Khusus Admin!" });
    }
};

// Pasang gembok (Harus Login + Harus Admin)
router.use(verifyToken);
router.use(isAdmin);

// ==========================================
// 1. KELOLA PRODUK (CRUD)
// ==========================================

// GET ALL PRODUCTS (Ini yang tadi 404 di Postman)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ msg: "Gagal ambil data produk" });
    }
});

// CREATE PRODUCT
router.post('/products', async (req, res) => {
    try {
        const { productName, price, stock, description, image } = req.body;

        // 🛡️ VALIDASI: Harga & Stok tidak boleh minus
        if (price < 0 || stock < 0) {
            return res.status(400).json({ msg: "Harga dan Stok tidak boleh kurang dari 0!" });
        }

        await Product.create({ productName, price, stock, description, image });
        res.json({ msg: "Produk berhasil ditambah!" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal tambah produk" });
    }
});

// UPDATE PRODUCT (DENGAN VALIDASI MINUS)
router.put('/products/:id', async (req, res) => {
    try {
        const { price, stock } = req.body;

        // 🛡️ VALIDASI: Cek kalau ada update harga/stok, pastikan gak minus
        if ((price !== undefined && price < 0) || (stock !== undefined && stock < 0)) {
            return res.status(400).json({ msg: "Harga dan Stok tidak boleh kurang dari 0!" });
        }

        await Product.update(req.body, { where: { id: req.params.id } });
        res.json({ msg: "Produk berhasil diupdate!" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal update produk" });
    }
});

// DELETE PRODUCT
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ msg: "Produk berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal hapus produk" });
    }
});

// ==========================================
// 2. KELOLA USERS
// ==========================================

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: "Error ambil user" });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        await User.update({ name, email, role }, { where: { id: req.params.id } });
        res.json({ msg: "User updated" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal update user" });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ msg: "User deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal hapus user" });
    }
});

// AMBIL LOG USER (Buat Monitor Terminal)
router.get('/users/:id/logs', async (req, res) => {
    try {
        const logs = await Log.findAll({
            where: { userId: req.params.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Gagal ambil log" });
    }
});

// ==========================================
// 3. KELOLA API KEYS
// ==========================================

router.get('/keys', async (req, res) => {
    try {
        // Include User biar nama pemilik muncul
        const keys = await ApiKey.findAll({
            include: [{ 
                model: User,
                attributes: ['name', 'email'] 
            }] 
        });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ msg: "Gagal ambil keys" });
    }
});

// REGENERATE KEY USER LAIN (Ini yang tadi 404 di Postman)
router.put('/keys/:id/regenerate', async (req, res) => {
    try {
        // Cari key berdasarkan ID (bukan userId, tapi ID tabel api_keys)
        const keyRecord = await ApiKey.findByPk(req.params.id);
        
        if (!keyRecord) return res.status(404).json({ msg: "API Key tidak ditemukan" });

        const newKeyString = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');

        await keyRecord.update({ key: newKeyString });

        // Catat Log Admin melakukan aksi ini (Opsional, tapi bagus buat audit)
        // Kita catat atas nama User pemilik key saja biar muncul di monitor dia
        await Log.create({
            method: 'UPDATE',
            endpoint: 'ADMIN_REGENERATE_KEY',
            statusCode: 200,
            responseTime: 0,
            userAgent: 'Admin Action',
            userId: keyRecord.userId
        });

        res.json({ msg: "Key berhasil di-reset oleh Admin", apiKey: newKeyString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal reset key" });
    }
});

module.exports = router;