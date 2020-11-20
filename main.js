require('dotenv').config();
const visitManagerUtils = require('./src/visitManagerUtils');

function parse_args() {
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

function validate_args(args) {
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

async function ping_servers() {
  try {
    const response = await visitManagerUtils.ping();
    return response.status === 200;
  } catch (error) {
    console.error("Error while pinging server: ", error.code);
    return false;
  }
}

async function createEstablishments(number_establishments) {
  const promises = visitManagerUtils.createEstablishments(number_establishments);
  Promise.all(promises)
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

const main = () => {
  console.log('Here we are!');
  args = parse_args();
  if (!validate_args(args)) {
    return 1;
  }
  console.log('Args detected correctly!');
  if (!ping_servers()) {
    return 2;
  }
  console.log('Servers up and running!');
  if (!createEstablishments(args['establishments'])) {
    return 3;
  }
  console.log('Establishments created correctly!');
};

if (require.main === module) {
  main();
}
