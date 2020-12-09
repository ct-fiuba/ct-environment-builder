const axios = require('axios');
const random = require('random')

const BASE_URL = process.env.VISIT_MANAGER_URL;
const PROB_HAS_EXIT = 0.5;
const PROB_OPEN_PLACE = 0.2;
const MEDIAN_M2 = 20;
const STANDARD_DEVIATION_M2 = 3;
const MEDIAN_VISIT_DURATION = 15;
const STANDARD_DEVIATION_VISIT_DURATION = 2;

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
  m2Generator = random.normal(mu=MEDIAN_M2, sigma=STANDARD_DEVIATION_M2);
  estimatedVisitDurationGenerator = random.normal(mu=MEDIAN_VISIT_DURATION, sigma=STANDARD_DEVIATION_VISIT_DURATION);
  for (let i = 0; i < number_establishments; i++) {
    _m2 = m2Generator();
    _estimatedVisitDuration = estimatedVisitDurationGenerator();
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
          hasExit: random.float() <= PROB_HAS_EXIT,
          m2: String(_m2 >= 1 ? Math.floor(_m2) : 1),
          estimatedVisitDuration: String(String(_estimatedVisitDuration >= 1 ? Math.floor(_estimatedVisitDuration) : 1)),
          openPlace: random.float() <= PROB_OPEN_PLACE
        },
      ],
    });
  }
  return establishments;
}

module.exports = { ping: getVisitManagerPing, createEstablishments: postEstablishments};
