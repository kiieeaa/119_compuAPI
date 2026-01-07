const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Ambil token dari header (Format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: "Akses ditolak. Silakan login." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token tidak valid." });
        
        // Simpan data user ke request agar bisa dipakai di route selanjutnya
        req.user = user; 
        next();
    });
};

module.exports = verifyToken;