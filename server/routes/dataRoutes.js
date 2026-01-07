const express = require('express');
const router = express.Router();
const checkApiKey = require('../middleware/checkKey');
const Product = require('../models/Product');

// 1. ENDPOINT PUBLIK (Untuk Halaman Katalog di Website Kamu)
// Perhatikan: Tidak ada middleware 'checkApiKey' disini
// server/routes/dataRoutes.js

router.get('/catalog-preview', async (req, res) => {
    try {
        // Kita HAPUS limit-nya, supaya server kirim SEMUA (200+) data ke frontend
        const products = await Product.findAll({ 
            order: [['price', 'DESC']] 
        });
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Error server" });
    }
});

// 2. ENDPOINT PRIVATE (Untuk Client/Orang lain yang pakai API Key)
// Ini tetap diproteksi
router.get('/products', checkApiKey, async (req, res) => {
    try {
        const products = await Product.findAll({ limit: 200 });
        res.json({
            success: true,
            count: products.length,
            message: "Data berhasil diambil menggunakan API Key Anda.",
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error server" });
    }
});

module.exports = router;