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
    let mandatoryParams = ['users', 'establishments', 'mobility', 'days'];
    let numericParams = ['users', 'establishments', 'mobility', 'days', 'infected'];

    let mandatoryCheckErrors = mandatoryParams.filter(p => !args.hasOwnProperty(p));
    if (mandatoryCheckErrors.length !== 0) {
        console.log(`Error: I didn't receive the arguments needed: ${mandatoryCheckErrors}`);
        return false;
    }
    
    let validationErrors = [];
    args['n95Mandatory'] = (args['n95Mandatory'] === 'true');
    numericParams.forEach(p => {
        args[p] = args.hasOwnProperty(p) ? parseInt(args[p]) : 0;
        if (isNaN(args[p])) {
            validationErrors.push(`Error: Non numeric values for the arguments needed: ${p}`);
        }
    });
    if (validationErrors.length !== 0) {
        console.log(validationErrors);
        return false;
    }
    return true;
}

module.exports = { parseArgs, validateArgs };
