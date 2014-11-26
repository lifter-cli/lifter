/**
* @module lifterPrompts
*/
var validation = require('../validation/validation.js');

/**
* Object containing questions for CLI (each within their own object)
* @object
* @memberof module:lifterPrompts
* @param {object} obj Object of objects each containing a question asked within command line interface, possible selectionoptions (if any), validation methods and conditional next questions
*/
var promptList = {
  username: {
    promptText: 'Please ensure you are in the parent directory of your application before continuing with Lifter Config\n' +
      'What is your Docker Hub username?\nIf you don\'t have a Docker Hub account, ' +
      'get one at https://hub.docker.com/account/signup/',
    promptClass: 'username',
    validation: validation.hasValue,
    nextClass: function() {return 'containerName';}
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
    promptText: 'Name your Docker container',
    promptClass: 'containerName',
    validation: validation.hasValue,
    nextClass: function() {return 'repoName';}
  },

  repoName: {
    promptText: 'Name your repo',
    promptClass: 'repoName',
    validation: validation.isValidRepoName,
    nextClass: function() {return 'launchCommand';}
  },

  launchCommand: {
    promptText: 'Enter the command you want to launch when you start up your container.',
    promptClass: 'launchCommand',
    validation: validation.hasValue,
    nextClass: function() {return 'portPublic';}
  },

  // launchPath: {
  //   promptText: 'What is the filepath that corresponds to your command? \nType \'.\' if you want to execute your command this directory.',
  //   promptClass: 'launchPath',
  //   validation: validation.hasValue,
  //   nextClass: function() {return 'portPrivate';}
  // },

  portPublic: {
    promptText: 'What port can access your Docker container? (Example: 80)',
    promptClass: 'portPublic',
    validation: validation.inPortRange,
    nextClass: function() {return 'portPrivate';}
  },

  portPrivate: {
    promptText: 'What port does your application use? (Example: 49160)',
    promptClass: 'portPrivate',
    validation: validation.inPortRange,
    nextClass: function() {return 'db';}
  },



  // Future Linux OS options may include 'Ubuntu', 'Fedora', 'Red Hat', 'Linux'
/*
  linuxOS: {
    promptText: 'Pick an OS',
    promptOptions: ['centos:6'],
    yamlSyntax: {'centos:6': 'centos:centos6'},
    promptClass: 'linuxOS',
    validation: validation.inOptions,
    nextClass: function() {return 'envVar';}
  },
*/

/*
  envVar: {
    promptText: 'Enter any environmental variables your app needs to run.',
    promptClass: 'envVar',
    validation: validation.noValidation,
    nextClass: function() {return 'db';}
  },
*/

  db: {
    promptText: 'Pick a database',
    promptOptions: ['mongoDB', 'No Database'],
    yamlSyntax: {'mongoDB': 'mongoDB', 'No Database': 'None'},
/*
    promptOptions: ['mongoDB', 'mySQL', 'redis', 'No Database'],
    yamlSyntax: {'mongoDB': 'mongoDB', 'mySQL': 'mySQL', 'redis': 'redis', 'No Database': 'None'},
*/
    promptClass: 'db',
    validation: validation.inOptions,
    nextClass: function() {return null;}
  },

  // Temporarily disabling scaffolding (feature has not been developed yet)
  // scaffolding: {
  //   promptText: 'Do you want scaffolding?',
  //   promptOptions: ['Yes!', 'Nope.'],
  //   promptClass: 'scaffolding',
  //   validation: validation.inOptions,
  //   nextClass: function(answer) {
  //     console.log('In nextClass key of scaffolding');
  //     if(answer === 'Yes!') {
  //       return 'appServer';
  //     } else {
  //       return null;
  //     }
  //   }
  // },

  // appServer: {
  //   promptText: 'Pick a back end',
  //   promptOptions: ['Node with Express', 'Node without Express', 'Apache'],
  //   promptClass: 'appServer',
  //   validation: validation.inOptions,
  //   nextClass: function() {return 'mvc';}
  // },
  //
  //
  // mvc: {
  //   promptText: 'Pick an MVC',
  //   promptOptions: ['Angular', 'Backbone', 'No MVC'],
  //   promptClass: 'mvc',
  //   validation: validation.inOptions,
  //   nextClass: function() {return null;}
  // },

};

module.exports = {
  promptList : promptList
}
