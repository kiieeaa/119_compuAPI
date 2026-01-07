const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Product = db.define('product', {
    productName: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2) },
    stock: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT } // <--- TAMBAHAN BARU
}, {
    freezeTableName: true,
    tableName: 'products'
});

module.exports = Product;