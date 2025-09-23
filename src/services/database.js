const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

async function simpleExecute(statement, binds = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(statement, binds);
        return { rows };
    } catch (err) {
        console.error('Error executing SQL:', err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

module.exports.simpleExecute = simpleExecute;