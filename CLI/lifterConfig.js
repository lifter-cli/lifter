var prompt = require('../node_modules/prompt');
var fs = require('fs');
var yaml = require('../node_modules/js-yaml');
var lifterPrompts = require('./lifterPrompts.js');

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

// valid ports
// 1024 to 65535

// Initialiize object of container properties
var containerProperties = {
  currentWorkingDir: process.cwd()
};

// Ask question and store input
exports.picker = function(obj) {
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

