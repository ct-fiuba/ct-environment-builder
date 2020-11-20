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

const main = () => {
  console.log('Here we are!');
  args = parse_args();
  if (!validate_args(args)) {
    return 1;
  }
  console.log('Args detected correctly!');
  if (!ping_servers()) {
    return 1;
  }
  console.log('Servers up and running!');
};

if (require.main === module) {
  main();
}
