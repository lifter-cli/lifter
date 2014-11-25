#! /usr/local/bin/node

var program = require('../node_modules/commander');
var lifterConfig = require('./commands/lifterConfig.js');
var lifterPrompts = require('./prompts/lifterPrompts.js');
var lifterInit = require('./commands/lifterInit.js')
var lifterPush = require('./commands/lifterPush.js');
var lifterDeploy = require('./commands/lifterDeploy.js');
var lifterMonitor = require('./commands/lifterMonitor.js');
var lifterShell = require('./commands/lifterShell.js');
var exec = require('child_process').exec;

// Doing this to make the help screen look correct
program._name = 'lifter';

/**
* Object with methods describing version of command line tool as well as associated options
* @Object
*/
program
  .version('0.0.1')
  .usage('\n  lifter - making Docker deployment easier since 2014')

/**
* Object with method and description attached to 'lifter config' command
* @Object
*/
program
  .command('config')
  .description('Configure your container')
  .action(function() {
    lifterConfig.startQuestions(lifterPrompts.promptList.username);
  });

/**
* Object with method and description attached to 'lifter init' command
* @Object
*/
program
  .command('init')
  .description('Build your container')
  .action(function() {
    console.log('Time to build your container.');
    lifterInit.start_b2d();
  });

program
  .command('shell')
  .description('Grab command to enter shell')
  .action(function() {
    lifterShell.printCommand();
  })

/**
* Object with method and description attached to 'lifter push' command
* @Object
*/
program
  .command('push')
  .description('Commit and push your container\'s image to DockerHub')
  .action(function() {
    console.log('Time to send your image');
    lifterPush.copyMounted();
  });

/**
* Object with method and description attached to 'lifter deploy' command
* @Object
*/
program
  .command('deploy')
  .description('Deploy your application')
  .action(function() {
    console.log('Time to deploy to Azure');
    lifterDeploy.checkAzure();
  });

/**
* Object with method and description attached to 'lifter deploy' command
* @Object
*/
program
  .command('monitor')
  .description('Monitor your containers ')
  .action(function() {
    console.log('Launching the Lifter UI to monitor your containers');
    console.log('Go to http://localhost:3123/');
    lifterMonitor.lifterMonitor();
  });

/**
* Object with method and description attached to any command not stipulated above
* @Object
*/
program
  .command('*')
  .description('Handle unexpected commands')
  .action(function(env){
    console.log('Please enter a valid lifter command.');
    program.help();
  });

// process.argv should always have two default arguments: '/usr/local/bin/node' and '/usr/local/bin/lifter'
// if process.argv has a length of less than 3, presume that only 'lifter' has been entered (i.e. no additional commands)
if(process.argv.length < 3) {
  program.help();
  process.exit();
}

program.parse(process.argv);
