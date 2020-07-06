var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e =  new _events();

//Instantiate CLI module object
var cli = {};

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