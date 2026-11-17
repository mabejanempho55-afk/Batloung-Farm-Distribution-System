
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();
console.log('TiDB host:', process.env.DB_HOST || 'MISSING');
console.log('Database name:', process.env.DB_NAME || 'MISSING');
console.log('Database user configured:', !!process.env.DB_USER);

const isTiDB = process.env.DB_HOST &&
    process.env.DB_HOST.includes('tidbcloud.com');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isTiDB ? {
        ca: fs.readFileSync(
            process.env.DB_CA_PATH || '/etc/secrets/isrgrootx1.pem'
        ),
        rejectUnauthorized: true
    } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
