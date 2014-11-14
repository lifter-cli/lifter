/**
* @module lifterPrompts
*/
var validation = require('./validation/validation.js');

/**
* Object containing questions for CLI (each within their own object)
* @object
* @memberof module:lifterPrompts
* @param {object} obj Object of objects each containing a question asked within command line interface, possible selectionoptions (if any), validation methods and conditional next questions
*/
exports.promptList = {
  username: {
    promptText: 'What is your dockerHub username?',
    promptClass: 'username',
    validation: validation.hasValue,
    nextClass: 'containerName'
  },

/*
  password: {
    promptText: 'What is your dockerHub password?',
    promptClass: 'password',
    validation: validation.authenticateUser,
    nextClass: 'containerName'
  },
*/

  containerName: {
    promptText: 'Name your container',
    promptClass: 'containerName',
    validation: validation.hasValue,
    nextClass: 'repoName'
  },

  repoName: {
    promptText: 'Name your repo',
    promptClass: 'repoName',
    validation: validation.hasValue,
    nextClass: 'launchCommand'
  },

  launchCommand: {
    promptText: 'Enter the command you want to launch when you start up your container.',
    promptClass: 'launchCommand',
    validation: validation.hasValue,
    nextClass: 'launchPath'
  },

  launchPath: {
    promptText: 'What is the filepath that corresponds to your command? \nType \'.\' if you want to execute your command from your current working directory.',
    promptClass: 'launchPath',
    validation: validation.hasValue,
    nextClass: 'portPrivate'
  },

  portPrivate: {
    promptText: 'What private port do you want to use? (Example: 49160)',
    promptClass: 'portPrivate',
    validation: validation.inPortRange,
    nextClass: 'portPublic'
  },

  portPublic: {
    promptText: 'What public port do you want to use? (Example: 8080)',
    promptClass: 'portPublic',
    validation: validation.inPortRange,
    nextClass: 'linuxOS'
  },

  linuxOS: {
    promptText: 'Pick an OS',
    promptOptions: ['centos:6', 'Ubuntu', 'Fedora', 'Red Hat', 'Linux'],
    promptClass: 'linuxOS',
    validation: validation.inOptions,
    nextClass: 'db'
  },

  db: {
    promptText: 'Pick a database',
    promptOptions: ['mongoDB', 'Parse', 'mySQL', 'Redis', 'No Database'],
    promptClass: 'db',
    validation: validation.inOptions,
    nextClass: 'scaffolding'
  },

  scaffolding: {
    promptText: 'Do you want scaffolding?',
    promptOptions: ['Yes!', 'Nope.'],
    promptClass: 'scaffolding',
    validation: validation.inOptions,
    nextClass: function(answer) {
      console.log('In nextClass key of scaffolding');
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
    validation: validation.inOptions,
    nextClass: 'envVar'
  },

  envVar: {
    promptText: 'Enter any environmental variables your app needs to run.',
    promptClass: 'envVar',
    validation: validation.hasValue,
    nextClass: 'mvc'
  },

  mvc: {
    promptText: 'Pick an MVC',
    promptOptions: ['Angular', 'Backbone', 'No MVC'],
    promptClass: 'mvc',
    validation: validation.inOptions,
    nextClass: null
  },

};