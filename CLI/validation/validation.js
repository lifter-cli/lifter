exports.returnTrue = function() {
  return true;
};

exports.authenticateUser = function(obj) {
  // just for now
  return true;
};

exports.inPortRange = function(obj) {
  if(obj.value >=1024 && obj.value <=65535) {
    return true;
  } else {
    return false;
  }
};

exports.inOptions = function(obj) {
  if(obj.options.indexOf(obj.value) >-1) {
    return true;
  } else {
    return false;
  }
};
