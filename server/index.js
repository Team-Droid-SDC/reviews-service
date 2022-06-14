const express = require('express');
const cors = require('cors');
const ctrl = require('./controllers');
require('dotenv').config();
// initialize server
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Server running.'));
app.get(`/${process.env.LOADER_IO}/`, (req, res) => {
  res.send(`${process.env.LOADER_IO}`)
})
app.use(cors());

// routes
app.get('/reviews', ctrl.getReviews);
app.get('/reviews/meta', ctrl.getReviewsMeta);
app.post('/reviews', ctrl.postReviews);
app.put('/reviews/:review_id/helpful', ctrl.markHelpful);
app.put('/reviews/:review_id/report', ctrl.report);

// listening on port 8080

app.listen(process.env.SERVER_PORT, () => console.log(`listening on port ${process.env.SERVER_PORT}, monitor at ${process.env.SERVER_ADDRESS}`));
