const http = require('k6/http');
const { sleep } = require('k6');

export let options = {
vus: 1000,
duration: "30s",
};

export default function () {
http.get(`http://localhost:8080/reviews/?product_id=${Math.floor(Math.random() * (1000000)) + 1}`);
};
