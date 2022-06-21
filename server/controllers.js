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
  models.reviewsQuery({ ...req.query, page, count })
    .then((reviewsResult) => {
      reviewsResult.rows.map(item => {
        item.date = new Date(+item.date).toISOString();
        return item;
      })
      res.status(200).send({
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
