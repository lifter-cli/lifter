/**
* @module validation
*/

/**
* Placeholder function that just returns true instead of running any sort of validation on input data
* @function
* @memberof module:validation
*/
exports.returnTrue = function() {
  return true;
};

/**
* Function that authenticates input username and password against Dockerhub API
* @function
* @memberof module:validation
* @param {object} obj Object of parameters passed in with username and password
*/
exports.authenticateUser = function(obj) {
  // just for now
  return true;
};

/**
* Function that checks whether input ports are within available range
* @function
* @memberof module:validation
* @param {object} obj Object with portPublic or portPrivate parameter
*/
exports.inPortRange = function(obj) {
  if(obj.value >=1024 && obj.value <=65535) {
    return true;
  } else {
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
    return false;
  }
};
