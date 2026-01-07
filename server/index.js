const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const apiLogger = require('./middleware/apiLogger'); // Import Logger

// Import Models
const User = require('./models/User');
const ApiKey = require('./models/ApiKey');
const Log = require('./models/Log');



const app = express();

app.use(cors());
app.use(express.json());

// --- 1. SETUP RELASI DATABASE (ASSOCIATIONS) ---

// KITA TAMBAHKAN { foreignKey: 'userId' } AGAR MATCHING SAMA DATABASE
User.hasMany(ApiKey, { foreignKey: 'userId', onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Log, { foreignKey: 'userId', onDelete: 'SET NULL' });
Log.belongsTo(User, { foreignKey: 'userId' });

// --- 2. PASANG MIDDLEWARE LOGGER ---
// Taruh ini SEBELUM route definisi route
app.use(apiLogger);

// --- 3. DEFINISI ROUTES ---
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const keyRoutes = require('./routes/keyRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/api/v1', dataRoutes); // Logger akan aktif di sini
app.use('/api/keys', keyRoutes);
app.use('/api/admin', adminRoutes);

// --- 4. SYNC DATABASE & START SERVER ---
// Alter: true agar kolom baru di tabel Log otomatis dibuat tanpa hapus data lama
db.sync({ alter: true }) 
    .then(() => {
        console.log("✅ Database Synced & Relations Established!");
        app.listen(5000, () => console.log("🚀 Server running on port 5000"));
    })
    .catch(err => console.log("❌ Database Error:", err));