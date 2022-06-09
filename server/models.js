const { client } = require('../db');
/**
 *
 * @param {int} product_id
 * @param {int} page
 * @param {int} count
 * @param {string} sort - "newest", "helpful", or "relevant"
 */
exports.reviewsQuery = ({ product_id, page = 1, count = 5, sort }) => {
  const query = `SELECT * from reviews
    where (
      product_id = $1 and reported = false and (
        id BETWEEN (
          ($3 * ($2 - 1)) + 1
          ) AND (
            $3 * $2
        )
      )
    )
  `
  const values = [product_id, page, count];
  return client.query(query, values)
}