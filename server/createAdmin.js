const bcrypt = require('bcrypt');
const User = require('./models/User');
const db = require('./config/db');

const createAdmin = async () => {
    try {
        await db.sync({ alter: true }); // Update struktur tabel (nambah kolom role)

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("admin123", salt); // Password Admin

        await User.create({
            name: "Super Admin",
            email: "admin@compuapi.com",
            password: hash,
            role: "admin" // <--- Peran Admin
        });

        console.log("✅ Akun Admin Berhasil Dibuat!");
        console.log("Email: admin@compuapi.com");
        console.log("Pass: admin123");
        process.exit();
    } catch (err) {
        console.error("Gagal buat admin:", err);
    }
};

createAdmin();