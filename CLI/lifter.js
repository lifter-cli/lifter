#! /usr/local/bin/node

var program = require('commander');
var prompt = require('prompt');
var fs = require('fs');
var yaml = require('js-yaml');

// Initialiize object of container properties
var containerProperties = {
  currentWorkingDir: process.cwd()
};

// Format prompt options, when needed
var enumerateOptions = function(options) {
  var str = '';
  if(options !== undefined) {
    for(var i=0;i<options.length;i++) {
      str += (i+1) + '. ' + options[i] + '\n';
    }
  }
  return str;
};

// Build prompt descriptions
var makeDescription = function(text, options) {
  return text + '\n' + enumerateOptions(options);
};

// Vaildate input
var validChoice = function(obj, choice) {
  return ((!obj.promptOptions) || obj.promptOptions.indexOf(choice) > -1) ? true : false;
};

// Ask question and store input
var picker = function(obj) {
  console.log('obj: ', obj);
  prompt.message = "Question! > ".white;
  prompt.delimiter = "".green;

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

        // nextEvent handles decision trees
        var nextEvent = typeof obj.nextClass === 'function' ? obj.nextClass(value) : obj.nextClass;
//         console.log(nextEvent);

        if(nextEvent !== null) {
          picker(promptList[nextEvent]);
        } else {
          console.log('Good work.  Run lifter config to build a container.');
          console.log(containerProperties);
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

// List of prompts
// Using nextClass to sequence questions - which kinda sucks
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
    promptText: 'What is the filepath that corresponds to your command? \nType \'.\' if you want to execute your command from your current working directory.',
    promptClass: 'launchPath',
    nextClass: 'linuxOS'
  },

  linuxOS: {
    promptText: 'Pick an OS',
    promptOptions: ['CentOS', 'Ubuntu', 'Fedora', 'Red Hat', 'Linux'],
    promptClass: 'linuxOS',
    nextClass: 'db'
    },

  db: {
    promptText: 'Pick a database',
    promptOptions: ['mongoDB', 'Parse', 'mySQL', 'Redis'],
    promptClass: 'db',
    nextClass: 'scaffolding'
    },

  scaffolding: {
    promptText: 'Do you want scaffolding?',
    promptOptions: ['Yes!', 'Nope.'],
    promptClass: 'scaffolding',
    nextClass: function(answer) {
        console.log('In nextClass key of scaffolding');
        // nextClass is dependent on whether user wants scaffolding
        if(answer === 'Yes!') {
          return 'appServer';
        } else {
          return null;
        }
      }
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
    nextClass: null
    },

};


// CLI Details
program
  .version('0.0.1')
  .usage('lifter - making Docker containers easier since 2014')
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
