const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

const checkApiKey = async (req, res, next) => {
    // 1. Cari key di header atau query params
    // Orang lain nanti request pakai header: 'x-api-key': 'kunci_mereka'
    const keyFromHeader = req.headers['x-api-key'];
    const keyFromQuery = req.query.api_key;
    
    const clientKey = keyFromHeader || keyFromQuery;

    if (!clientKey) {
        return res.status(401).json({ 
            success: false, 
            message: "API Key tidak ditemukan. Akses ditolak." 
        });
    }

    try {
        // 2. Cek ke database apakah key valid & aktif
        const keyRecord = await ApiKey.findOne({ 
            where: { key: clientKey, isActive: true },
            include: User // Kita bisa lihat siapa pemilik key ini (opsional)
        });

        if (!keyRecord) {
            return res.status(403).json({ 
                success: false, 
                message: "API Key tidak valid atau sudah tidak aktif." 
            });
        }

        // (Opsional) Kamu bisa console.log siapa yang akses
        console.log(`User ${keyRecord.user.name} mengakses data pada ${new Date()}`);

        // 3. Lolos! Lanjut ke controller data
        next();

    } catch (error) {
        res.status(500).json({ message: "Server Error saat validasi key" });
    }
};

module.exports = checkApiKey;