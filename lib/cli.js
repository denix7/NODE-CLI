var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e =  new _events();

var os = require('os');
var v8 = require('v8');

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
    var commands = {
        'exit' : 'Kill the CLI',
        'man' : 'Show this help page',
        'help' : 'Alias of the "man" command',
        'stats' : 'Get statistics on the underlying operating system',
        'list users' : 'Show a list of all the registered users in the system',
        'more user info --{userId}' : 'Show details of a specif user',
        'list checks --up --down' : 'Show a list of all the active checks in the system',
        'more check info --{checkId}' : 'Show details of a specified check',
        'list logs' : 'Show a list of all the log files available to be read',
        'more log info' : 'Show details of a specified log file'
    }

    //Show a header for the help page that is a wide as the screen
    cli.horizontalLine();
    cli.center('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    //Show each command, followed by its explanation, in white and yellow respectively
    for(var key in commands)
    {
        if(commands.hasOwnProperty(key)){
            var value = commands[key];
            var line = '\x1b[33m' + key + '\x1b[0m';
            var padding = 60 - line.length;
            for(i=0; i<padding; i++)
            {
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);

    cli.horizontalLine();
}
//Craete vertical line
cli.verticalSpace = (lines) => {
    lines = typeof(lines) == 'number' && lines >0 ? lines : 1;
    for(i = 0; i<lines; i++)
    {
        console.log('');
    }
}
//Create horizontal line
cli.horizontalLine = () =>{
    var width = process.stdout.columns;
    var line = '';
    
    for(i=0; i<width; i++)
    {
        line+='-';
    }
    console.log(line);
};

//Create center text
cli.center = (str) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    var width = process.stdout.columns;

    //calculate the left padding there shuld be
    var leftPadding = Math.floor((width - str.length) / 2);

    //put in left padded spaces before the string itself
    var line = '';
    for(i = 0; i < leftPadding; i++)
    {
        line+=' ';
    }
    line+=str;
    console.log(line);
}

//Exit
cli.responders.exit = () => {
    process.exit(0);
}

//Stats
cli.responders.stats = () => {
    var stats = {
        'Platform' : os.platform(),
        'Type' : os.type(),
        'Load Average' : os.loadavg().join(' '),
        'CPU content' : os.cpus().length,
        'Total Memery' : Math.round(os.totalmem() / 1000000000) + ' GB',
        'Free Memory' : Math.round(os.freemem() / 1000000000) + ' GB',
        'Current Maloced Memory' : v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)' : Math.round(v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size * 100),
        'Available Heap Allocated (%)' : Math.round(v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit * 100),
        'Uptime' : os.uptime() + ' seconds'
    }

    cli.horizontalLine();
    cli.center('STATS STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for(var key in stats)
    {
        if(stats.hasOwnProperty(key))
        {
            var value = stats[key];
            line = '\x1b[33m' + key + '\x1b[0m';
            padding = 60 - line.length

            for(i = 0; i < padding; i++)
            {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.horizontalLine();
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