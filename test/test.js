const { doesNotMatch } = require('assert');
const assert = require('assert');
const { client } = require('../db');
const models = require('../server/models');

describe('Database Connection', () => {
  it('should load and log current time', () => {
    client.query('SELECT NOW()');
    assert.equal(true, true);
  });
  it('should be able to get all columns from reviews by product ID', async () => {
    const productIds = [1, 500, 7000, 40];
    const results = [];
    for (let i = 0; i < productIds.length; i++) {
      results.push(await client.query('SELECT * from reviews where product_id = $1', [productIds[i]]));
    }
    assert.equal(results.length, productIds.length);
    assert.equal(results[0].rows.length, 3);
    assert.equal(results[1].rows.length, 3);
    assert.equal(results[2].rows.length, 9);
    assert.equal(results[3].rows.length, 15);
  });
});
describe('Model queries', () => {
  describe('ReviewsQuery', () => {
    it('should find reviews by id, page, and count', async () => {
      const searchObjects = [
        {
          product_id: 500,
          page: 1,
          count: 5,
        },
        {
          product_id: 7000,
          page: 1,
          count: 5,
        }
      ];
      const results = [];
      for (let i = 0; i < searchObjects.length; i++) {
        results.push(await models.reviewsQuery(searchObjects[i]));
      }
      assert.equal(results.length, 2);
      assert.equal(results[0].rows.length, 3);
      assert.equal(results[1].rows.length, 5);
    });
    it('should sort results properly by helpfulness', async () => {
      const searchObjects = [
        {
          product_id: 500,
          page: 1,
          count: 5,
        },
        {
          product_id: 7000,
          page: 1,
          count: 5,
        },
        {
          product_id: 40,
          page: 1,
          count: 15,
        },
      ];
      const results = [];
      const helpfulResults = [];
      for (let i = 0; i < searchObjects.length; i++) {
        results.push(await models.reviewsQuery(searchObjects[i]));
      }
      for (let i = 0; i < results.length; i++) {
        helpfulResults.push([]);
        for (let j = 0; j < results[i].rows.length; j++) {
          helpfulResults[i].push(results[i].rows[j].helpfulness);
        }
      }
      for (let i = 0; i < helpfulResults.length; i++) {
        assert.equal(helpfulResults[i].every((item, index) => index === 0 || item <= helpfulResults[i][index - 1]), true);
      }
    });
    it('should sort results properly by newest', async () => {
      const searchObjects = [
        {
          product_id: 500,
          page: 1,
          count: 5,
          sort: 'newest',
        },
        {
          product_id: 7000,
          page: 1,
          count: 5,
          sort: 'newest',
        },
        {
          product_id: 40,
          page: 1,
          count: 15,
          sort: 'newest',
        },
      ];
      const results = [];
      const dateResults = [];
      for (let i = 0; i < searchObjects.length; i++) {
        results.push(await models.reviewsQuery(searchObjects[i]));
      }
      for (let i = 0; i < results.length; i++) {
        dateResults.push([]);
        for (let j = 0; j < results[i].rows.length; j++) {
          dateResults[i].push(results[i].rows[j].date);
        }
      }
      for (let i = 0; i < dateResults.length; i++) {
        assert.equal(dateResults[i].every((item, index) => index === 0 || item >= dateResults[i][index - 1]), true);
      }
    });
  });
  describe('MetaQuery', () => {
    it('FILL IN MIGHT NEED ASYNC', () => {

    });
  });
});