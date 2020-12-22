require('dotenv').config();
const visitManagerUtils = require('./src/visitManagerUtils');
const authUtils = require('./src/authUtils');

function parseArgs() {
  args = {};
  process.argv.forEach(function (val, index, array) {
    if (index >= 2) {
      key = val.split('=')[0]
      value = val.split('=')[1]
      args[key] = value;
    }
  });
  return args;
}

function validateArgs(args) {
  if (!args.hasOwnProperty('users') || !args.hasOwnProperty('establishments')) {
    console.log("Error: I didn't receive the arguments needed: users and establishments");
    return false;
  }
  args['users'] = parseInt(args['users']);
  args['establishments'] = parseInt(args['establishments']);
  if (isNaN(args['users']) || isNaN(args['establishments'])) {
    console.log("Error: I didn't receive numeric values for the arguments needed: users and establishments");
    return false;
  }
  return true;
}

async function pingServers() {
  try {
    const response_visit_manager = await visitManagerUtils.ping();
    const response_auth_server = await authUtils.ping();
    return response_visit_manager.status === 200 && response_auth_server.status === 200 ;
  } catch (error) {
    console.error("Error while pinging servers: ", error.code);
    return false;
  }
}

async function createEstablishments(number_establishments) {
  const promises = visitManagerUtils.createEstablishments(number_establishments);
  return Promise.all(promises)
    .then(function (results) {
      failing_results = results.filter(result => result.status !== 201);
      if (failing_results.length > 0) {
        console.log(`Error while creating establishments, ${failing_results.length} failed`);
      }
      return true;
    })
    .catch((error)=>{
      console.log("Error while creating establishments: ", error.code);
      return false;
    });
}

async function createUsers(number_users) {
  const promises = authUtils.createUsers(number_users);
  return Promise.all(promises)
    .then(function (results) {
      failing_results = results.filter(result => result.status !== 201);
      if (failing_results.length > 0) {
        console.log(`Error while creating users, ${failing_results.length} failed`);
      }
      return true;
    })
    .catch((error)=>{
      if (error.response.data.reason === 'EMAIL_EXISTS') {
        console.log(`${JSON.parse(error.config.data)['email']} already created`);
        return true;
      }
      console.log("Error while creating users: ", error.response.data.reason);
      return false;
    });
}

async function main() {
  console.log('Starting Environment Builder!');
  args = parseArgs();
  if (!validateArgs(args)) {
    return 1;
  }
  console.log('Args detected correctly!');
  ping_servers_result = await pingServers();
  if (!ping_servers_result) {
    return 2;
  }
  console.log('Servers up and running!');
  establishments_result = await createEstablishments(args['establishments']);
  if (!establishments_result) {
    return 3;
  }
  console.log('Establishments created correctly!');
  users_result = await createUsers(args['users']);
  if (!users_result) {
    return 4;
  }
  console.log(users_result);
  console.log('Users created correctly!');
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
