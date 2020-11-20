require('dotenv').config();

const parse_args = () => {
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

const validate_args = (args) => {
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

const main = () => {
  console.log('Here we are!');
  args = parse_args();
  if (!validate_args(args)) {
    return 1;
  }
  console.log('Success!');
  console.log(args);
};

if (require.main === module) {
  main();
}
