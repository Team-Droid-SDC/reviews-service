const express = require('express');
const ctrl = require('./controllers');

// initialize server
const app = express();
app.get('/', (req, res) => res.send('Server running.'));

// routes
app.get('/reviews', ctrl.getReviews);
app.get('/reviews/meta', ctrl.getReviewsMeta);
app.post('/reviews', ctrl.postReviews);
app.put('/reviews/:review_id/helpful', ctrl.markHelpful);
app.put('/reviews/:review_id/report', ctrl.report);

// listening on port 3000

app.listen(3000, () => console.log('listening on port 3000, monitor at http://localhost:3000'));
