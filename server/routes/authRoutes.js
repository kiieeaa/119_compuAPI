const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Cek email duplikat
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({ msg: "Register Berhasil!" });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ msg: "Email tidak ditemukan" });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Password salah" });

        // Buat Token
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        
        const accessToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role }, // Masukkan role ke token
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // KIRIM ROLE KE FRONTEND
        res.json({ accessToken, role: user.role });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
});

module.exports = router;