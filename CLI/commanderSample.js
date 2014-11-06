#! /usr/local/bin/node

var program = require('commander');
var prompt = require('prompt');

console.log(process);

var containerProperties = {
  mvc: null,
  os: null,
  db: null,
  appServer: null,
  launchPath: null,
  launchCommand: null,
  currentWorkingDir: null,
  containerName: null,
  dockerHubName: null
};

var picker = function(obj) {
  prompt.message = "Question!".white;
  prompt.delimiter = " > < \n".green;

  prompt.start();

  prompt.get({
    properties: {
      name: {
        description: obj.promptText.magenta
      }
    }
  }, function (err, result) {
    console.log(result);

    if(obj.promptOptions.indexOf(parseInt(result.name) === -1)) {
      console.log('Please make a choice.  Otherwise, we will put ',obj.promptOptions[0],'in your container.');
      picker(obj);
    } else {
      containerProperties['mvc'] = {mvcCode: result.name, mvcName: listOfMVC[parseInt(result.name)]};
    }

    if(result.name === '1') {
      containerProperties.mvc = 'Angular';
    } else if(result.name === '2') {
      containerProperties.mvc = 'Backbone';
    } else {
      mvcUnclear();
      pickMVC();
    }

    containerProperties['mvc'] = {mvcCode: result.name, mvcName: listOfMVC[parseInt(result.name)]};
    console.log(containerProperties);
  });

}

var promptSequence = [
  {},
  {},
  {},
  {},
]


/* picker({
  promptText: 'Pick an MVC',
  promptOptions: listOfMVC,
  promptClass: MVC,
  nextClass: DB
});
*/

// function that asks user to pick an MVC
var pickMVC = function() {
  prompt.message = "Question!".white;
  prompt.delimiter = " > < \n".green;

  prompt.start();

  prompt.get({
    properties: {
      name: {
        description: "Pick an MVC that you'd like to use.  (Suggested: Angular)\n 1. Angular \n 2. Backbone".magenta
      }
    }
  }, function (err, result) {
    console.log(result);
    if(result.name === '1') {
      containerProperties.mvc = 'Angular';
    } else if(result.name === '2') {
      containerProperties.mvc = 'Backbone';
    } else {
      mvcUnclear();
      pickMVC();
    }

    containerProperties['mvc'] = {mvcCode: result.name, mvcName: listOfMVC[parseInt(result.name)]};
    console.log(containerProperties);
  });

};

var mvcUnclear = function() {
  console.log('Please make a choice.  Otherwise, we will put Angular in your container.');
};

var listsOfOptions = {
  mvc: ['Angular', 'Backbone'],
  os: ['CentOS', 'Ubuntu', 'Fedora', 'Red Hat', 'Linux'],
  db: ['mongoDB', 'Parse', 'mySQL', 'Redis'],
  appServer: ['Node w/Express', 'Node w/o Express', 'Apache']
//   launchCommand: // command to launch app inside of Docker container
//   launchPath: // relative path within Docker container
//   currentWorkingDir: // ask if we should use current working director OR input something
//   d

};





program
  .version('0.0.1')
  .usage('Proof of concept')
  .option('config', 'Builds YAML file based on user\'s desired configuration');
  .option('init', 'Initializes container.');

program
  .command('MVC')
  .description('List MVCs I can use.')
  .action(function() {
    pickMVC();
  });

program
  .command('*')
  .description('Handle odd responses')
  .action(function(env){
    mvcUnclear();
    pickMVC();
  });

program.parse(process.argv);
