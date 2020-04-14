const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/shop_app', { logging: false });

module.exports = db;
