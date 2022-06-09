const models = require('./models');

/**
 * Fetches reviews for product
 * @query { int } product_id
 * @query { int default = 1 } page
 * @query { int default = 5 } count
 * @query { string } sort - "newest", "helpful", or "relevant"
 */
exports.getReviews = (req, res) => {
  const page = (req.query.page < 1) ? 1 : req.query.page;
  const count = (req.query.count < 1) ? 5 : req.query.count;
  models.reviewsQuery(req.query)
    .then(result => res.send(result.rows.slice(count * (page - 1), page * count)))
    .catch(err => console.log(err));
};

/**
 * Fetches review meta data by id
 * @query { int } product_id
 */
exports.getReviewsMeta = (req, res) => {
  res.send('fetching reviews meta');
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
  res.send('posting to reviews');
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
