const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const Log = require('../models/Log');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// --- 1. FUNGSI GENERATOR KEY KHUSUS (SAMA DENGAN USER) ---
const generateCustomKey = () => {
    const prefix = 'compu-';
    let numbers = '';
    
    // Loop 18 kali untuk 18 digit angka acak
    for (let i = 0; i < 18; i++) {
        numbers += Math.floor(Math.random() * 10);
    }

    return prefix + numbers;
};

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

// GET ALL PRODUCTS
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

        // Validasi: Harga & Stok tidak boleh minus
        if (price < 0 || stock < 0) {
            return res.status(400).json({ msg: "Harga dan Stok tidak boleh kurang dari 0!" });
        }

        await Product.create({ productName, price, stock, description, image });
        res.json({ msg: "Produk berhasil ditambah!" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal tambah produk" });
    }
});

// UPDATE PRODUCT
router.put('/products/:id', async (req, res) => {
    try {
        const { price, stock } = req.body;

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

// REGENERATE KEY USER LAIN (ADMIN ACTION)
router.put('/keys/:id/regenerate', async (req, res) => {
    try {
        // Cari key berdasarkan ID tabel api_keys
        const keyRecord = await ApiKey.findByPk(req.params.id);
        
        if (!keyRecord) return res.status(404).json({ msg: "API Key tidak ditemukan" });

        // --- BAGIAN INI YANG DIUBAH (PAKAI FUNGSI CUSTOM) ---
        const newKeyString = generateCustomKey();
        // ----------------------------------------------------

        await keyRecord.update({ key: newKeyString });

        // Catat Log: Admin me-reset key user ini
        await Log.create({
            method: 'UPDATE',
            endpoint: 'ADMIN_REGENERATE_KEY',
            statusCode: 200,
            responseTime: 0,
            userAgent: 'Admin Action',
            userId: keyRecord.userId // Log dicatat di history user tersebut
        });

        res.json({ msg: "Key berhasil di-reset oleh Admin", apiKey: newKeyString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal reset key" });
    }
});

module.exports = router;