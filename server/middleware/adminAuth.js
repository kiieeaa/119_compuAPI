const verifyAdmin = (req, res, next) => {
    // req.user didapat dari middleware auth sebelumnya (verifyToken)
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses Ditolak. Halaman ini khusus Admin." });
    }
    next();
};

module.exports = verifyAdmin;