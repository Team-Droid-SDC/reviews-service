const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect((err) => {
  if (err) {
    console.log(err);
  }
});

client.query('select now()', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('db connected:', res.rows[0].now);
  }
});

module.exports = { client };