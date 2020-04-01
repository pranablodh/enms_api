const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();

//Postgres Configuration
const pool = new pg.Pool
({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.on('connect', () => 
{
    console.log('Connected to the DB');
});

module.exports = { pool };