const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect();

client.query('select now()', (err, res) => {
  console.log(err, res.rows[0]);
});

module.exports = { client };