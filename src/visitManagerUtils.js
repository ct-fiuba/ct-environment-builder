const axios = require('axios');
const random = require('random')

const BASE_URL = process.env.VISIT_MANAGER_URL;
const PROB_HAS_EXIT = 0.5;
const PROB_OPEN_PLACE = 0.2;
const MEDIAN_M2 = 20;
const STANDARD_DEVIATION_M2 = 3;
const STANDARD_DEVIATION_MOBILITY = 1;
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
  m2Generator = random.normal(mu = MEDIAN_M2, sigma = STANDARD_DEVIATION_M2);
  estimatedVisitDurationGenerator = random.normal(mu = MEDIAN_VISIT_DURATION, sigma = STANDARD_DEVIATION_VISIT_DURATION);
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

function postVisits(visits, visits_by_space, visits_by_user, mobility, days) {
  generateVisits(visits, visits_by_space, visits_by_user, mobility, days);
  promises = visits.map(visit => axios.post(`${BASE_URL}/visits`, visit));
  return promises;
}

function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateRandomDate(d) {
  ts = new Date();
  ts.setDate(ts.getDate() - d);
  ts.setHours(ts.getHours() - random.int(0, 24));
  ts.setMinutes(ts.getMinutes() - random.int(0, 60));
  return ts;
}

function generateVisits(visits, visits_by_space, visits_by_user, mobility, days) {
  mobilityGenerator = random.normal(mu = mobility, sigma = STANDARD_DEVIATION_MOBILITY);
  users_emails = Object.keys(visits_by_user);
  for (let d = 1; d <= days; d++) {
    for (let i = 0; i < users_emails.length; i++) {
      current_user_email = users_emails[i]
      mobility_current_day = mobilityGenerator();
      mobility_current_day = mobility_current_day >= 0 ? Math.floor(mobility_current_day) : 0;
      for (let j = 0; j < mobility_current_day; j++) {
        spaces_ids = Object.keys(visits_by_space);
        space_id = spaces_ids[random.int(0, spaces_ids.length - 1)];
        current_visit = {
          scanCode: space_id,
          userGeneratedCode: generateRandomString(),
          timestamp: generateRandomDate(d)
        };
        visits.push(current_visit);
        visits_by_user[current_user_email].push(current_visit);
        visits_by_space[space_id].push(current_visit);
      }
    }
  }
  return visits;
}

module.exports = {
  ping: getVisitManagerPing,
  createEstablishments: postEstablishments,
  createVisits: postVisits,
};
