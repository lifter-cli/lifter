#! /usr/local/bin/node

var program = require('commander');
var prompt = require('prompt');
var fs = require('fs');
var yaml = require('js-yaml');

var containerProperties = {
  currentWorkingDir: process.cwd()
};

var enumerateOptions = function(options) {
  var str = '';
  if(options !== undefined) {
    for(var i=0;i<options.length;i++) {
      str += (i+1) + '. ' + options[i] + '\n';
    }
  }
  return str;
};

var makeDescription = function(text, options) {
  return text + '\n' + enumerateOptions(options);
};

var validChoice = function(obj, choice) {
  return ((!obj.promptOptions) || obj.promptOptions.indexOf(choice) > -1) ? true : false;
};

var picker = function(obj) {
  prompt.message = "Question!".white;
  prompt.delimiter = " > < \n".green;

  prompt.start();

  prompt.get({
    properties: {
      name: {
        description: makeDescription(obj.promptText,obj.promptOptions)
      }
    }
  }, function(err, result) {

      var value = (!obj.promptOptions) ? result.name : obj.promptOptions[parseInt(result.name) - 1];

      if(validChoice(obj,value)) {
        containerProperties[obj.promptClass] = value;

        if(obj.nextClass !== null) {
          picker(promptList[obj.nextClass]);
        } else {
          console.log('Good work.  Run lifter config to build a container.');
//           console.log(containerProperties);
          var ymlDump = yaml.safeDump(containerProperties);
          fs.writeFile('lifter.yml',ymlDump,function(err){
            if(err) {console.log(err);}
          });
        }
      } else {
        console.log('Please make a choice.  Otherwise, we will put ',obj.promptOptions[0],'in your container.');
        picker(obj);
      }
  });
};

var promptList = {
  username: {
    promptText: 'What is your dockerHub username?',
    promptClass: 'username',
    nextClass: 'containerName'
  },

  containerName: {
    promptText: 'Name your container',
    promptClass: 'containerName',
    nextClass: 'launchCommand'
  },

  launchCommand: {
    promptText: 'Enter the command you want to launch when you start up your container.',
    promptClass: 'launchCommand',
    nextClass: 'launchPath'
  },

  launchPath: {
    promptText: 'What is the filepath that corresponds to your command?  Type \'.\' if you want to execute your command from your current working directory',
    promptClass: 'launchPath',
    nextClass: 'linuxOS'
  },

  linuxOS: {
    promptText: 'Pick an OS',
    promptOptions: ['CentOS', 'Ubuntu', 'Fedora', 'Red Hat', 'Linux'],
    promptClass: 'linuxOS',
    nextClass: 'appServer'
    },

  appServer: {
    promptText: 'Pick a back end',
    promptOptions: ['Node with Express', 'Node without Express', 'Apache'],
    promptClass: 'appServer',
    nextClass: 'mvc'
    },

  mvc: {
    promptText: 'Pick an MVC',
    promptOptions: ['Angular', 'Backbone'],
    promptClass: 'mvc',
    nextClass: 'db'
    },

  db: {
    promptText: 'Pick a database',
    promptOptions: ['mongoDB', 'Parse', 'mySQL', 'Redis'],
    promptClass: 'db',
    nextClass: null
    }
};

program
  .version('0.0.1')
  .usage('Proof of concept')
  .option('config', 'Builds YAML file based on user\'s desired configuration')
  .option('init', 'Initializes container.');

program
  .command('config')
  .description('Configure your container.')
  .action(function() {
    picker(promptList.username);
  });

program
  .command('init')
  .description('Build your container.')
  .action(function() {
    console.log('Time to build your container.');
  });

program
  .command('*')
  .description('Handle odd responses')
  .action(function(env){
    console.log('You must be confused.');
  });

program.parse(process.argv);
