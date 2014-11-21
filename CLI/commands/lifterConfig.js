var fs = require('fs');
var util = require('util');
var yaml = require('../../node_modules/js-yaml');
var lifterPrompts = require('../prompts/lifterPrompts.js');
var readline = require('readline');
var colors = require('colors');

/**
* Function that returns a string of the question and options (if any) for each prompt by the command line tool
* @function
* @param {string} text Question to be displayed by command line too
* @param {array} options Array of selections availale to the user for a given question
*/
var makeDescription = function(text, options) {
  util.puts('> ' + text.green);
  if(options !== undefined) {
    for(var i=0;i<options.length;i++) {
      util.puts((i+1).toString().underline + '. '.underline + options[i].underline);
    }
  }
};

/**
* Function that returns boolean relating to whether user made a valid choice from options provided in command line
* @function
* @param {array} obj Array of available prompt options
* @param {text} choice String of selection made by user
*/
var validateResponse = function(obj,value) {
  if(obj.promptClass === 'password') {
    return obj.validation({'username': containerProperties.username, 'password': value});
  }
  else {
    if(obj.promptOptions) {
      return obj.validation({'value': value, options: obj.promptOptions});
    } else {
      return obj.validation({'value': value});
    }
  }
};

/**
* Object containing all user input from prompt and an entry with the current working directory
* @object
*/
var containerProperties = {
  currentWorkingDir: process.cwd(),
  vmName: "vmNameHere",
  vmUsername: "vmUsernameHere"
};

var readCommandLine;
var startQuestions = function(obj) {
  readCommandLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  askConfigQuestion(obj);
}

/**
* Function that prompts questions on command line, writes answers to containerProperties objects, and builds YML file when complete
* THIS NEEDS TO BE MORE MODULAR
* @function
* @param {object} obj Object containing all attributes of prompted question
*/
var askConfigQuestion = function(obj) {

// uses util.puts to render question and options for each question
  makeDescription(obj.promptText, obj.promptOptions);
  readCommandLine.question('', function(text) {

    // Assign value as either entered text or the the text of the option selected
    var value = (!obj.promptOptions) ? text : obj.promptOptions[parseInt(text) - 1];

      if(validateResponse(obj,value)) {
        containerProperties[obj.promptClass] = value;

        // nextEvent handles decision trees
        var nextEvent = obj.nextClass(value);

        if(nextEvent !== null) {
          askConfigQuestion(lifterPrompts.promptList[nextEvent]);
        } else {
            console.log('Good work.  Run lifter init to build a container.');
//             console.log(containerProperties);

            readCommandLine.close();

            // make YML file
            var ymlDump = yaml.safeDump(containerProperties);

            fs.mkdir('./.lifter/', function(err) {

              fs.writeFile('./.lifter/lifter.yml',ymlDump,function(err) {
                if(err) {console.log(err);}
              });

            });
        }
      } else {
          // Error messages are in the appropriate validation functions
          askConfigQuestion(obj);
      }
  });
};

module.exports = {
  startQuestions: startQuestions
}
