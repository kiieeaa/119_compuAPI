const express = require('express');
const { v4: uuidv4 } = require('uuid'); 
const ApiKey = require('../models/ApiKey');
const Log = require('../models/Log');
const verifyToken = require('../middleware/auth'); 
const router = express.Router();

// GENERATE KEY
router.post('/generate', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const existingKey = await ApiKey.findOne({ where: { userId: userId } });
        if (existingKey) return res.status(400).json({ msg: "Sudah punya key.", key: existingKey.key });

        const newKey = await ApiKey.create({
            key: uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, ''),
            userId: userId, // Huruf kecil
            isActive: true
        });
        res.json({ msg: "Success", apiKey: newKey.key });
    } catch (error) { res.status(500).json({ msg: "Gagal generate" }); }
});

// GET KEY
router.get('/my-key', verifyToken, async (req, res) => {
    try {
        const apiKey = await ApiKey.findOne({ where: { userId: req.user.id } });
        res.json({ apiKey: apiKey ? apiKey.key : null, isActive: apiKey ? apiKey.isActive : false });
    } catch (error) { res.status(500).json({ msg: "Error" }); }
});

// REGENERATE KEY (Fix User Gak Bisa Regenerate)
router.put('/regenerate', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const existingKey = await ApiKey.findOne({ where: { userId: userId } });
        
        if (!existingKey) return res.status(404).json({ msg: "Belum punya key." });

        const newKeyString = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
        
        await ApiKey.update({ key: newKeyString }, { where: { userId: userId } });

        // Catat Log
        await Log.create({
            method: 'UPDATE', endpoint: 'REGENERATE_API_KEY', statusCode: 200, 
            responseTime: 0, userAgent: req.get('user-agent') || 'Browser',
            userId: userId
        });

        res.json({ msg: "Key baru berhasil dibuat!", apiKey: newKeyString });
    } catch (error) {
        console.error("Regenerate Error:", error);
        res.status(500).json({ msg: "Gagal mereset key" });
    }
});

module.exports = router;