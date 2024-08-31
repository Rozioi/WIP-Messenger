// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'gnom1234',
    port: 5432, // Порт по умолчанию для PostgreSQL
});

module.exports = pool;
