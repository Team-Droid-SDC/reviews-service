/* eslint-disable no-undef */
const chakram = require('chakram');
require('env').config();
describe('Server', () => {
  describe('Get Reviews', () => {
    it('should fetch reviews', () => {
      const response = chakram.get(`${process.env.SERVER_ADDRESS}/reviews?product_id=2&sort=newest&count=100`);
      chakram.expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});