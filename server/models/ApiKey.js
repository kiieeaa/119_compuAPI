const { DataTypes } = require('sequelize');
const db = require('../config/db');
// JANGAN ADA IMPORT USER DISINI

const ApiKeys = db.define('api_keys', {
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    // GAK PERLU TULIS userId DISINI, index.js YANG BAKAL BIKIN
}, {
    freezeTableName: true,
    tableName: 'api_keys'
});

// JANGAN ADA KODE RELASI DISINI (HAPUS JIKA ADA)

module.exports = ApiKeys;