#! /usr/local/bin/node

var program = require('../node_modules/commander');
var prompt = require('../node_modules/prompt');
var fs = require('fs');
var yaml = require('../node_modules/js-yaml');
var lifterConfig = require('./lifterConfig.js');
var lifterPrompts = require('./lifterPrompts.js');
var lifterInit = require('./lifterInit.js')
var lifterPush = require('./lifterPush.js');

/**
* Object with methods describing version of command line tool as well as associated options
* @Object
*/
program
  .version('0.0.1')
  .usage('lifter - making Docker containers easier since 2014')
  .option('config', 'Builds YAML file based on user\'s desired configuration')
  .option('init', 'Initializes container.')
  .option('push', 'Commits your docker image and pushes it to docker hub');

/**
* Object with method and description attached to 'lifter config' command
* @Object
*/
program
  .command('config')
  .description('Configure your container.')
  .action(function() {
    lifterConfig.picker(lifterPrompts.promptList.username);
  });

/**
* Object with method and description attached to 'lifter init' command
* @Object
*/
program
  .command('init')
  .description('Build your container.')
  .action(function() {
    console.log('Time to build your container.');
    lifterInit.start_b2d();
  });

/**
* Object with method and description attached to 'lifter push' command
* @Object
*/
program
  .command('push')
  .description('Commit and push your container\'s image to DockerHub.')
  .action(function() {
    console.log('Time to send your image');
    lifterPush.copyMounted();
  });

/**
* Object with method and description attached to any command not stipulated above
* @Object
*/
program
  .command('*')
  .description('Handle odd responses')
  .action(function(env){
    console.log('You must be confused.');

  });

if ( !program.args ){
  console.log('Please enter in "lifter config" to set your container settings');
}

program.parse(process.argv);
