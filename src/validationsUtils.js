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
    if (!args.hasOwnProperty('users')) {
        console.log("Error: I didn't receive the arguments needed: users");
        return false;
    }
    if (!args.hasOwnProperty('establishments')) {
        console.log("Error: I didn't receive the arguments needed: establishments");
        return false;
    }
    if (!args.hasOwnProperty('mobility')) {
        console.log("Error: I didn't receive the arguments needed: mobility");
        return false;
    }
    if (!args.hasOwnProperty('days')) {
        console.log("Error: I didn't receive the arguments needed: days");
        return false;
    }
    args['users'] = parseInt(args['users']);
    args['establishments'] = parseInt(args['establishments']);
    args['mobility'] = parseInt(args['mobility']);
    args['days'] = parseInt(args['days']);
    args['n95Mandatory'] = (args['n95Mandatory'] === 'true')
    if (isNaN(args['users'])) {
        console.log("Error: I didn't receive numeric values for the arguments needed: users");
        return false;
    }
    if (isNaN(args['establishments'])) {
        console.log("Error: I didn't receive numeric values for the arguments needed: establishments");
        return false;
    }
    if (isNaN(args['mobility'])) {
        console.log("Error: I didn't receive numeric values for the arguments needed: mobility");
        return false;
    }
    if (isNaN(args['days'])) {
        console.log("Error: I didn't receive numeric values for the arguments needed: days");
        return false;
    }
    return true;
}

module.exports = { parseArgs, validateArgs };
