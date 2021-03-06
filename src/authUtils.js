const axios = require('axios');

const BASE_URL = process.env.AUTH_SERVER_URL;

function getAuthServerPing() {
  return axios.get(`${BASE_URL}/`);
}

function postUsers(number_users) {
  users = generateUsers(number_users);
  promises = users.map(user => axios.post(`${BASE_URL}/users/signUp`, user));
  return promises;
}

function generateUsers(number_users) {
  users = [];
  for (let i = 0; i < number_users; i++) {
    users.push({
      email: `user_${i}@gmail.com`,
      DNI: `${i}`,
      password: `user_${i}`,
    });
  }
  return users;
}

function createVisitsByUserObjects(number_users) {
  visits_by_user = {};
  for (let i = 0; i < number_users; i++) {
    visits_by_user[`user_${i}@gmail.com`] = [];
  }
  return visits_by_user;
}

module.exports = {
  ping: getAuthServerPing,
  createUsers: postUsers,
  createVisitsByUserObjects
};
