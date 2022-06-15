const http = require('k6/http');
const { sleep } = require('k6');
export let options = {
vus: 1000, //stimulate how many virtual users
duration: "30s", //how long you want it to run
};
//Below randomize the endpoints
export default function () {
http.get(`http://localhost:8080/reviews/meta?product_id=${Math.floor(Math.random() * (1000000)) + 1}`);
}

// k6 run test/k6script-meta.js