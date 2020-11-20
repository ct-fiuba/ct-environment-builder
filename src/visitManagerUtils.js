const axios = require('axios');

const BASE_URL = process.env.VISIT_MANAGER_URL;

function getVisitManagerPing() {
  return axios.get(`${BASE_URL}/`);
}

function postEstablishments(number_establishments) {
  establishments = generateEstablishments(number_establishments);
  promises = establishments.map(establishment => axios.post(`${BASE_URL}/establishments`, establishment));
  return promises;
}

function generateEstablishments(number_establishments) {
  establishments = [];
  for (let i = 0; i < number_establishments; i++) {
    establishments.push({
      type: 'restaurant',
      name: `establishment_${i}`,
      email: `establishment_${i}@gmail.com`,
      address: `Address_${i}`,
      city: 'CABA',
      state: 'CABA',
      zip: '1430ACV',
      country: 'Argentina',
      spaces: [
        {
          name: "Primer piso",
          hasExit: false,
          m2: "100",
          estimatedVisitDuration: "10",
          openPlace: false
        },
      ],
    });
  }
  return establishments;
}

module.exports = { ping: getVisitManagerPing, createEstablishments: postEstablishments};
