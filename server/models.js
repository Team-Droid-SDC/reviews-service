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
  const sortQuery = sort === 'newest' ? 'date asc' : 'helpfulness desc';
  return client.query(`
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
        product_id = ${product_id}
      )
      GROUP BY reviews.id
    ) AS data
    WHERE row BETWEEN ((${page} - 1) * ${count} + 1) AND (${page} * ${count})
    ORDER BY row
  `)
}

/**
 *
 * @param {int} product_id
 * @returns {Promise} query
 */
exports.metaQuery = ({ product_id }) => {
  return client.query(`
    SELECT json_build_object(
      'product_id', ${product_id},
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
              reviews ON (ref = rating AND product_id = ${product_id})
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
              product_id = ${product_id} AND recommend = false
            )
          ),
          '1', (
            SELECT
              COUNT(*)
            FROM
              reviews
            WHERE (
              product_id = ${product_id} AND recommend = true
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
                    ROUND(AVG(value)::numeric, 4)
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
          product_id = ${product_id}
        )
      )
    ) data
  `);
}

/**
 *
 * @param {ReviewObject} review
 * {
 *  product_id,
 *  rating,
 *  *optional* summary,
 *  body,
 *  recommend,
 *  name,
 *  email,
 *  *optional* photos,
 *  characteristics
 * }
 */
exports.insertReview = (review) => {
  return client.query(`
    INSERT INTO reviews (
      product_id,
      rating,
      summary,
      body,
      recommend,
      reviewer_name,
      reviewer_email
    ) VALUES (
      '${review.product_id}',
      '${review.rating}',
      '${review.summary}',
      '${review.body}',
      '${review.recommend}',
      '${review.name}',
      '${review.email}'
    );

  `)
}