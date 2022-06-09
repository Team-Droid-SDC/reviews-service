const { client } = require('../db');
/**
 *
 * @param {int} product_id
 * @param {int} page
 * @param {int} count
 * @param {string} sort - "newest", "helpful", or "relevant"
 */
exports.reviewsQuery = ({ product_id, sort }) => {
  const sortQuery = sort === 'newest' ? 'order by date desc' : 'order by helpfulness desc';
  const query = `SELECT * from reviews
    where (
      product_id = $1
    )
    ${sortQuery}
  `
  const values = [product_id];
  return client.query(query, values)
}

// const query = `SELECT * from reviews
// where (
//   product_id = $1 and reported = false and (
//     id BETWEEN (
//       ($3 * ($2 - 1)) + 1
//     ) AND (
//       $3 * $2
//     )
//   )
// )
// ${sortQuery}
// `