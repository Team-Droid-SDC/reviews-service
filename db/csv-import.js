const { client } = require('./index');
const copyFrom = require('pg-copy-streams').from;
const csv = require('csv-stream');
const fs = require('fs');
const path = require('path');

// client.query('select * from reviews', (err, res) => {
//   console.log(err, res);
// });

let options = {
  columns: [
    'id',
    'product_id',
    'rating',
    'date',
    'summary',
    'body',
    'recommend',
    'reported',
    'reviewer_name',
    'reviewer_email',
    'response',
    'helpfulness',
  ],
  escapeChar: '"',
  enclosedChar: '"'
};
const reviewsCsvStream = csv.createStream(options);

const reviewsFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'reviews.csv');
const characteristicsFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'characteristics.csv');
const reviewsPhotosFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'reviews_photos.csv');
const characteristicReviewsFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'characteristic_reviews.csv');

const reviewsQuery = `INSERT INTO reviews
  (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  returning id, summary, body, reviewer_name, reviewer_email
`
client.query('truncate table reviews cascade')
  .then(res => console.log(res))
  .catch(err => console.log('error clearing table:', err));
// client.query(`copy reviews from '${reviewsFile}' csv header`)
//   .then(res => console.log(res))
//   .catch(err => console.log('error copying reviews from csv file:', err));

fs.createReadStream(reviewsFile).pipe(reviewsCsvStream)
  .on('error', (err) => {
    console.log(err);
  })
  .on('data', (data) => {
    // console.log('data:', data);
    client.query(reviewsQuery, Object.values(data))
      // .then(res => console.log(res.rows))
      .catch(err => console.log('client query', err));
  });

  // copy reviews from '/home/gilcohen67/hackreactor/rfp2204/sdc/sdc-import-data/reviews.csv' csv header;
