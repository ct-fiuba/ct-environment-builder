const axios = require('axios');

const BASE_URL = process.env.VISIT_MANAGER_URL;

function getVisitManagerPing() {
  return axios.get(`${BASE_URL}/`);
}

module.exports = { ping: getVisitManagerPing};
