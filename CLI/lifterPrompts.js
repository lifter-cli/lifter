// List of prompts
// Using nextClass to sequence questions - which kinda sucks
exports.promptList = {
  username: {
    promptText: 'What is your dockerHub username?',
    promptClass: 'username',
    nextClass: 'password'
  },

  password: {
    promptText: 'What is your dockerHub password?',
    promptClass: 'password',
    nextClass: 'containerName'
  },

  containerName: {
    promptText: 'Name your container',
    promptClass: 'containerName',
    nextClass: 'repoName'
  },

  repoName: {
    promptText: 'Name your repo',
    promptClass: 'repoName',
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
    nextClass: 'portPrivate'
  },

  portPrivate: {
    promptText: 'What private port do you want to use? (Example: 49160)',
    promptClass: 'portPrivate',
    nextClass: 'portPublic'
  },

  portPublic: {
    promptText: 'What public port do you want to use? (Example: 8080)',
    promptClass: 'portPublic',
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
    promptOptions: ['mongoDB', 'Parse', 'mySQL', 'Redis', 'No Database'],
    promptClass: 'db',
    nextClass: 'scaffolding'
  },

  scaffolding: {
    promptText: 'Do you want scaffolding?',
    promptOptions: ['Yes!', 'Nope.'],
    promptClass: 'scaffolding',
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
    nextClass: 'envVar'
  },

  envVar: {
    promptText: 'Enter any environmental variables your app needs to run.',
    promptClass: 'envVar',
    nextClass: 'mvc'
  },

  mvc: {
    promptText: 'Pick an MVC',
    promptOptions: ['Angular', 'Backbone', 'No MVC'],
    promptClass: 'mvc',
    nextClass: null
  },

};