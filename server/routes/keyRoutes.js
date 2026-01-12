const express = require('express');
const router = express.Router();
const ApiKey = require('../models/ApiKey'); // Pastikan path model sesuai
const Log = require('../models/Log');       // Pastikan path model sesuai
const verifyToken = require('../middleware/auth'); // Middleware auth

// --- 1. FUNGSI GENERATOR KEY KHUSUS ---
const generateCustomKey = () => {
    const prefix = 'compu-';
    let numbers = '';
    
    // Loop 18 kali untuk mendapatkan 18 digit angka acak
    for (let i = 0; i < 18; i++) {
        numbers += Math.floor(Math.random() * 10);
    }

    // Gabungkan prefix dan angka
    // Hasil contoh: "compu-643781947672168719"
    return prefix + numbers;
};

// --- 2. ROUTES ---

// GENERATE KEY BARU (POST)
// Endpoint ini dipanggil saat user menekan tombol "Generate API Key" pertama kali
router.post('/generate', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 

        // Cek apakah user sudah punya key sebelumnya
        const existingKey = await ApiKey.findOne({ where: { userId: userId } });
        if (existingKey) {
            return res.status(400).json({ msg: "Sudah punya key.", key: existingKey.key });
        }

        // Generate format baru menggunakan fungsi di atas
        const newKeyString = generateCustomKey();

        const newKey = await ApiKey.create({
            key: newKeyString,
            userId: userId,
            isActive: true
        });

        res.json({ msg: "Success", apiKey: newKey.key });
    } catch (error) {
        console.error("Generate Error:", error);
        res.status(500).json({ msg: "Gagal generate" }); 
    }
});

// GET MY KEY (GET)
// Endpoint untuk menampilkan Key di Dashboard
router.get('/my-key', verifyToken, async (req, res) => {
    try {
        const apiKey = await ApiKey.findOne({ where: { userId: req.user.id } });
        res.json({ 
            apiKey: apiKey ? apiKey.key : null, 
            isActive: apiKey ? apiKey.isActive : false 
        });
    } catch (error) { 
        console.error("Get Key Error:", error);
        res.status(500).json({ msg: "Error server" }); 
    }
});

// REGENERATE KEY (PUT)
// Endpoint ini dipanggil saat user menekan tombol "Reset"
router.put('/regenerate', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const existingKey = await ApiKey.findOne({ where: { userId: userId } });
        
        if (!existingKey) return res.status(404).json({ msg: "Belum punya key." });

        // Generate format baru lagi
        const newKeyString = generateCustomKey();
        
        // Update key di database
        await ApiKey.update({ key: newKeyString }, { where: { userId: userId } });

        // Catat Log aktivitas reset key ini
        await Log.create({
            method: 'UPDATE', 
            endpoint: 'REGENERATE_API_KEY', 
            statusCode: 200, 
            responseTime: 0, 
            userAgent: req.get('user-agent') || 'Browser',
            userId: userId
        });

        res.json({ msg: "Key baru berhasil dibuat!", apiKey: newKeyString });
    } catch (error) {
        console.error("Regenerate Error:", error);
        res.status(500).json({ msg: "Gagal mereset key" });
    }
});

module.exports = router;