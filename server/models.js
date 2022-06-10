const { client } = require('../db');
/**
 *
 * @param {int} product_id
 * @param {int} page
 * @param {int} count
 * @param {string} sort - "newest", "helpful", or "relevant"
 * @returns {Promise} query
 */
exports.reviewsQuery = ({ product_id, page, count, sort }) => {
  const sortQuery = sort === 'newest' ? 'date desc' : 'helpfulness desc';
  const query = `
  SELECT
    review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos
  FROM
    (
    SELECT
      reviews.id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
      ARRAY_REMOVE ( ARRAY_AGG (url), NULL ) photos,
      ROW_NUMBER () OVER (ORDER BY ${sortQuery}) row
      FROM reviews LEFT OUTER JOIN reviews_photos ON reviews.id = review_id
      WHERE (
        product_id = $1
      )
      GROUP BY reviews.id
    ) AS data
    WHERE row BETWEEN (($2 - 1) * $3 + 1) AND ($2 * $3)
    ORDER BY row
  `
  const values = [product_id, page, count];
  return client.query(query, values)
}

/**
 *
 * @param {int} product_id
 * @returns {Promise} query
 */
exports.metaQuery = ({ product_id }) => {
  return client.query(`
    SELECT json_build_object(
      'product_id', $1::int,

      'ratings', (
        SELECT
          json_object_agg(r.ref, r.num) result
        FROM  (
          SELECT
            ref,
            count(rating) AS num
          FROM
            unnest(ARRAY [1, 2, 3, 4, 5]) ref
            LEFT JOIN
              reviews ON (ref = rating AND product_id = $1::int)
          GROUP BY ref
          ORDER BY ref
        ) r
      ),

      'recommended', (
        SELECT json_build_object(
          '0', (
            SELECT
              COUNT(*)
            FROM
              reviews
            WHERE (
              product_id = $1::int AND recommend = false
            )
          ),
          '1', (
            SELECT
              COUNT(*)
            FROM
              reviews
            WHERE (
              product_id = $1::int AND recommend = true
            )
          )
        )
      ),

      'characteristics', (
        SELECT json_object_agg(
          name,
            (
              SELECT json_build_object(
                'id', characteristics.id,
                'value', (SELECT
                    AVG(value)
                  FROM
                    characteristic_reviews
                  WHERE (
                    characteristic_id = characteristics.id
                  )
                )
              )
            )
        ) from characteristics
        WHERE (
          product_id = $1
        )
      )

    ) data
  `, [product_id]);
}
