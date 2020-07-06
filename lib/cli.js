var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e =  new _events();

//Instantiate CLI module object
var cli = {};

//Input handlers
e.on('man', (str) => {
    cli.responders.help();
});

e.on('help', (str) => {
    cli.responders.help();
});

e.on('exit', (str) => {
    cli.responders.exit();
});

e.on('stats', (str) => {
    cli.responders.stats();
});

e.on('list users', (str) => {
    cli.responders.listUsers();
});

e.on('more user info', (str) => {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
    cli.responders.listChecks(str);
});

e.on('more check info', (str) => {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', (str) => {
    cli.responders.listLogs();
});

e.on('more log info', (str) => {
    cli.responders.moreLogInfo(str);
});

//Responders object
cli.responders = {};

//Help / Man
cli.responders.help = () => {
    console.log("your asked for help");
}

//Exit
cli.responders.exit = () => {
    console.log('your asked for exit');
}

//Stats
cli.responders.stats = () => {
    console.log('your asked for stats');
}

//Lis users
cli.responders.listUsers = () => {
    console.log('your asked for list users');
}

//More user info
cli.responders.moreUserInfo = (str) => {
    console.log('your asked for', str);
}

//List checks
cli.responders.listChecks = (str) => {
    console.log('your asked for', str);
}

//Stats
cli.responders.moreCheckInfo = (str) => {
    console.log('your asked for', str);
}

//List logs
cli.responders.listLogs = () => {
    console.log('your asked for list logs');
}

//More log info
cli.responders.moreLogInfo = (str) => {
    console.log('your asked for', str);
}

//Input processor
cli.processInput = function(str){
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    //Only process the input if the user wrote something. otherwise ignore it
    if(str){
        //Codify the unique strings that identify unique questions allowed
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        var matchFound = false;
        var counter = 0;
        uniqueInputs.some(function(input){
            if(str.toLowerCase().indexOf(input) > -1){
                matchFound = true;
                //emit an event matching the unique input, and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        if(!matchFound){
            console.log('Sorry, try again');
        }
    }
}


//Init script
cli.init = function(){
    //Send the start message to the console in dark blue
    console.log('\x1b[34m%s\x1b[0m',"The CLI is runing");

    //Start the interface
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    //Create and initial prompt
    _interface.prompt();

    //Handle each line of input separately
    _interface.on('line', function(str){
        //Send to the imput processor
        cli.processInput(str);

        //Reinitialize the prompt affter
        _interface.prompt();
    });

    //If the user stops the CLI, kill de associated process
    _interface.on('close', function(){
        process.exit(0);
    });
};


module.exports = cli;