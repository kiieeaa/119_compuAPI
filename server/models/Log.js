const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Log = db.define('Log', {
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusCode: {
        type: DataTypes.INTEGER,
        defaultValue: 200
    },
    responseTime: {
        type: DataTypes.INTEGER, // dalam milidetik (ms)
        defaultValue: 0
    },
    userAgent: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true // Otomatis bikin createdAt & updatedAt
});

module.exports = Log;