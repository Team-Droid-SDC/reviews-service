const { client } = require('./index');
const csv = require('csv-stream');
const fs = require('fs');
const path = require('path');

client.query('select * from reviews', (err, res) => {
  console.log(err, res);
});

let options = {
  columns: [
    'id',
    'product_id',
    'rating',
    'rating2',
    'summary',
    'body',
    'recommend',
    'reported',
    'reviewer_name',
    'reviewer_email',
    'response',
    'helpfulness',
  ]
};
const reviewsCsvStream = csv.createStream(options);

const reviewsFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'reviews.csv');
const characteristicReviewsFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'characteristic_reviews.csv');
const reviewsPhotosFile = path.join(__dirname, '..', '..', 'sdc-import-data', 'reviews_photos.csv');

const reviewsQuery = `INSERT INTO reviews
  (id, product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
`

fs.createReadStream(reviewsFile).pipe(reviewsCsvStream)
  .on('error', (err) => {
    console.log('error:', err);
  })
  .on('data', (data) => {
    // console.log('data:', data);
    const reviewData = {
      ...data,
      'rating': `${data.rating}.${data.rating2}`,
    }
    delete reviewData.rating2;
    client.query(reviewsQuery, Object.values(reviewData))
      .then(res => console.log(res.rows[0]))
      .catch(err => console.log('client query error', err));
  });
