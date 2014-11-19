// var request = require('request');
// var container = require('./containerProperties.js');

/**
* @module validation
*/

/**
* Placeholder function that just returns true instead of running any sort of validation on input data
* @function
* @memberof module:validation
*/
exports.hasValue = function(obj) {
  if(typeof obj.value === 'string' && obj.value.length > 0) {
    return true;
  } else {
    console.log('Please make a choice. Literally, anything would be better than just hitting \'enter\' before typing a single thing.'.red);
    return false;
  }
};

/**
* Function that authenticates input username and password against Dockerhub API
* @function
* @memberof module:validation
* @param {object} obj Object of parameters passed in with username and password
*/
exports.authenticateUser = function(obj) {

  var options = {
  url: 'https://index.docker.io/v1/users',
  auth: {
    username: username,
    password: password
    },
    method: 'GET'
  };

/*
  request(options,function(err, response, body){
    if(err) {
      console.log('Something went wrong.  Try again.');
      return false;
    } else {
      if(!JSON.parse(body) === 'OK') {
        console.log('Invalid password.  Try again.');
        return false;
      }
      return true;
    }
  });
*/
};

/**
* Function that checks whether input ports are valid
* @function
* @memberof module:validation
* @param {object} obj Object with portPublic or portPrivate parameter
*/
exports.inPortRange = function(obj) {
  if(parseInt(obj.value) >= 0 && parseInt(obj.value) <= 65535 && obj.value.length>= 1) {
    return true;
  } else {
    console.log('Please choose a port between 1024 and 65535.  Thanks a bunch.'.red);
    return false;
  }
};

/**
* Function that checks whether input data is within available options displayed in prompt
* @function
* @memberof module:validation
* @param {object} obj Object with input value and array of options
*/
exports.inOptions = function(obj) {
  if(obj.options.indexOf(obj.value) >-1) {
    return true;
  } else {
    console.log('Please choose an option from the list below.'.red);
    return false;
  }
};
