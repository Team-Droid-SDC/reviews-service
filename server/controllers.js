const models = require('./models');

/**
 * Fetches reviews for product
 * @query { int } product_id
 * @query { int default = 1 } page
 * @query { int default = 5 } count
 * @query { string } sort - "newest", "helpful", or "relevant"
 */
exports.getReviews = (req, res) => {
  if (!req.query.product_id) {
    res.sendStatus(400);
    return;
  }
  const page = (req.query.page > 0) ? req.query.page : '1';
  const count = (req.query.count > 0) ? req.query.count : '5';
  models.reviewsQuery({...req.query, page, count})
    .then((reviewsResult) => {
      reviewsResult.rows.map(item => {
        item.date = new Date(+item.date).toISOString();
        return item;
      })
      res.send({
        product: req.query.product_id,
        page: parseInt(page),
        count: parseInt(count),
        results: reviewsResult.rows
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err)
    });
};

/**
 * Fetches review meta data by id
 * @query { int } product_id
 */
exports.getReviewsMeta = (req, res) => {
  models.metaQuery(req.query)
    .then(metaResult => {
      res.send(metaResult.rows[0].data);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
};

/**
 * Submit a review to the database
 * @body { int } product_id
 * @body { int } rating
 * @body { text } summary
 * @body { text } body
 * @body { bool } recommend
 * @body { text } name
 * @body { text } email
 * @body { [text] } photos
 * @body { Object } characteristics
 *
 */
exports.postReviews = (req, res) => {
  models.insertReview(req.body)
    .then(() => res.sendStatus(201))
    .catch(err => {
      console.log(err);
      res.status(400).send(err)
    });
  // res.send('posting to reviews');
};

/**
 * Mark a review as helpful by id
 * @url_param { int } review_id
 */
exports.markHelpful = (req, res) => {
  res.send('marking review as helpful');
};

/**
 * Report a review by id
 * @url_param { int } review_id
 */
exports.report = (req, res) => {
  res.send('reporting review');
};
