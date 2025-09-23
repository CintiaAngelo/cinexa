// src/config/dbConfig.js
require('dotenv').config();

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: 10,     // Mínimo de conexões no pool
    poolMax: 10,     // Máximo de conexões no pool
    poolIncrement: 0 // Quantas conexões são abertas quando o pool precisa crescer
};