/**
* @module validation
*/

/**
* Checks to make sure they entered a non-empty response
* @function
* @memberof module:validation
*/
var hasValue = function(obj) {
  if(typeof obj.value === 'string' && obj.value.length > 0) {
    return true;
  } else {
    console.log('Please make a choice. Literally, anything would be better than just hitting \'enter\' before typing a single thing.'.red);
    return false;
  }
};

/**
* Placeholder function that just returns true instead of running any sort of validation on input data
* @function
* @memberof module:validation
*/
var noValidation = function(obj) {
  return true;
};

/**
* Function checks whether input is a valid Docker hub repo name
* Rule #1: 3 - 30 characters.
* Rule #2: Only lowercase letters, digits and _ - .
* @function
* @memberof module:validation
*/
var isValidRepoName = function(obj) {

  if(typeof obj.value !=='string'){
    console.log('Input is invalid because it is not a string');
    return false;
  }

  if(!isRepoValidLength(obj.value)){
    console.log('Input must be between 3- 30 characters');
    return false;
  }

  if(!isRepoValidCharacters(obj.value)){
    console.log('Input must be lowercase, number, or "_" "-" "." ');
    return false;
  }
  return true;
};

var isRepoValidLength = function(string){
  if(string.length < 3 || string.length > 30){
    return false;
  } else {
    return true;
  }
};

// NOTE: Hyphen is still throwing a false for some reason
var isRepoValidCharacters = function(string){
  // Regex tests for input must be lowercase, number, or "_" "-" "."
  var regex = /^[a-z0-9_\-\\.]+$/;
  if ( regex.test(string) ){
    return true;
  } else {
    return false;
  }
}
/**
* Function that authenticates input username and password against Dockerhub API
* @function
* @memberof module:validation
* @param {object} obj Object of parameters passed in with username and password
*/
var authenticateUser = function(obj) {

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
var inPortRange = function(obj) {
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
var inOptions = function(obj) {
  if(obj.options.indexOf(obj.value) >-1) {
    return true;
  } else {
    console.log('Please choose an option from the list below.'.red);
    return false;
  }
};

module.exports = {
  hasValue: hasValue,
  noValidation: noValidation,
  isValidRepoName: isValidRepoName,
  isRepoValidLength: isRepoValidLength,
  isRepoValidCharacters: isRepoValidCharacters,
  inPortRange: inPortRange,
  inOptions: inOptions
}