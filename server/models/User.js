const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Users = db.define('users', {
    // ... (id, name, email, password biarkan sama) ...
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    
    // TAMBAHKAN INI:
    role: { 
        type: DataTypes.STRING, 
        defaultValue: 'user' // Default user biasa
    }
}, {
    freezeTableName: true,
    tableName: 'users'
});

module.exports = Users;