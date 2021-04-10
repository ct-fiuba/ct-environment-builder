require('dotenv').config();
const visitManagerUtils = require('./src/visitManagerUtils');
const authUtils = require('./src/authUtils');
const validationsUtils = require('./src/validationsUtils');

visits = [];
visits_by_space = {};
visits_by_user = {};

async function pingServers() {
  try {
    const response_visit_manager = await visitManagerUtils.ping();
    const response_auth_server = await authUtils.ping();
    return response_visit_manager.status === 200 && response_auth_server.status === 200;
  } catch (error) {
    console.error("Error while pinging servers: ", error.code);
    return false;
  }
}

async function createEstablishments(number_establishments) {
  const promises = visitManagerUtils.createEstablishments(number_establishments, n95Mandatory);
  return Promise.all(promises)
    .then(function (results) {
      failing_results = results.filter(result => result.status !== 201);
      if (failing_results.length > 0) {
        console.log(`Error while creating establishments, ${failing_results.length} failed`);
      }
      results.map(result => visits_by_space[result.data.spaces[0]] = []);
      return true;
    })
    .catch((error) => {
      console.log("Error while creating establishments: ", error.code);
      return false;
    });
}

async function createUsers(number_users) {
  const promises = authUtils.createUsers(number_users);
  visits_by_user = authUtils.createVisitsByUserObjects(args['users']);
  return Promise.all(promises)
    .then(function (results) {
      failing_results = results.filter(result => result.status !== 201);
      if (failing_results.length > 0) {
        console.log(`Error while creating users, ${failing_results.length} failed`);
      }
      return true;
    })
    .catch((error) => {
      if (error.response.data.reason === 'EMAIL_EXISTS') {
        return true;
      }
      console.log("Error while creating users: ", error.response.data.reason);
      return false;
    });
}

async function createVisits(visits, visits_by_space, visits_by_user, mobility, days) {
  const promises = visitManagerUtils.createVisits(visits, visits_by_space, visits_by_user, mobility, days);
  return Promise.all(promises)
    .then(function (results) {
      failing_results = results.filter(result => result.status !== 201);
      if (failing_results.length > 0) {
        console.log(`Error while creating visits, ${failing_results.length} failed`);
      }
      return true;
    })
    .catch((error) => {
      console.log("Error while creating visits: ", error.response.data.reason);
      return false;
    });
}

async function main() {
  console.log('Starting Environment Builder!');
  args = validationsUtils.parseArgs();
  if (!validationsUtils.validateArgs(args)) {
    return 1;
  }
  console.log('Args detected correctly!');
  ping_servers_result = await pingServers();
  if (!ping_servers_result) {
    return 2;
  }
  console.log('Servers up and running!');
  establishments_result = await createEstablishments(args['establishments'], args['n95Mandatory']);
  if (!establishments_result) {
    return 3;
  }
  console.log('Establishments created correctly!');
  users_result = await createUsers(args['users']);
  if (!users_result) {
    return 4;
  }
  console.log('Users created correctly!');
  visits_result = await createVisits(visits, visits_by_space, visits_by_user, args['mobility'], args['days']);
  if (!visits_result) {
    return 5;
  }
  console.log('Visits created correctly!');
  console.log("All the visits: ", visits);
  console.log("Visits by user: ", visits_by_user);
  console.log("Visits by space: ", visits_by_space);
  return 0;
};

if (require.main === module) {
  (async () => {
    try {
      var return_code = await main();
      if (return_code === 0) {
        console.log("The environment was built correctly!");
      } else {
        console.log("ERROR: return code: ", return_code);
      }
    } catch (e) {
      console.log(e);
    }
  })();
}
