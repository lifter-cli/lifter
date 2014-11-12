var prompt = require('../node_modules/prompt');
var fs = require('fs');
var yaml = require('../node_modules/js-yaml');
var lifterPrompts = require('./lifterPrompts.js');

/**
* Function that lists the number and name of options available for a question in the command line tool
* @function
* @param {array} options Array of selections availale to the user for a given question
*/
var enumerateOptions = function(options) {
  var str = '';
  if(options !== undefined) {
    for(var i=0;i<options.length;i++) {
      str += (i+1) + '. ' + options[i] + '\n';
    }
  }
  return str;
};

/**
* Function that returns a string of the question and options (if any) for each prompt by the command line tool
* @function
* @param {string} text Question to be displayed by command line too
* @param {array} options Array of selections availale to the user for a given question
*/
var makeDescription = function(text, options) {
  return text + '\n' + enumerateOptions(options);
};

/**
* Function that returns boolean relating to whether user made a valid choice from options provided in command line
* @function
* @param {array} obj Array of available prompt options
* @param {text} choice String of selection made by user
*/
var validChoice = function(obj, choice) {
  return ((!obj.promptOptions) || obj.promptOptions.indexOf(choice) > -1) ? true : false;
};

/**
* Object containing all user input from prompt and an entry with the current working directory
* @object
*/
var containerProperties = {
  currentWorkingDir: process.cwd()
};

/**
* Function that prompts questions on command line, writes answers to containerProperties objects, and builds YML file when complete
* THIS NEEDS TO BE MORE MODULAR
* @function
* @param {object} obj Object containing all attributes of prompted question
*/
exports.picker = function(obj) {
  // console.log('obj: ', obj);
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
          exports.picker(lifterPrompts.promptList[nextEvent]);
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
        exports.picker(obj);
      }
  });
};
