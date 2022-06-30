const axios = require('axios');
const random = require('random')

const BASE_URL = process.env.VIRUS_TRACKER_URL;

function getVirusTrackerPing() {
  return axios.get(`${BASE_URL}/`);
}

function declareInfected(visits_by_user, nInfected) {
  requests = [];
  users_emails = Object.keys(visits_by_user);
  for (let i = 0; i < nInfected; i++) {
    current_user_email = users_emails[i];
    visits_from_user = visits_by_user[current_user_email];
    requests.push(visits_from_user.map(visit => {
      infection = {
        spaceId: visit.spaceId,
        userGeneratedCode: visit.userGeneratedCode
      };
      return axios.post(`${BASE_URL}/infected`, infection);
    }));
  }
  return requests;
}


module.exports = {
  ping: getVirusTrackerPing,
  declareInfected
};
