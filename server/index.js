const express = require('express');
const cors = require('cors');
const ctrl = require('./controllers');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Server running.'));
app.get(`/${process.env.LOADER_IO}/`, (req, res) => {
  res.send(`${process.env.LOADER_IO}`);
});
app.use(cors());

app.get('/reviews', ctrl.getReviews);
app.get('/reviews/meta', ctrl.getReviewsMeta);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on port ${process.env.SERVER_PORT}, monitor at ${process.env.SERVER_ADDRESS}`);
});
