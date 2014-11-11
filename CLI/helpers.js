var fs = require('fs');

exports.addSpace = function(str,num) {
  console.log(num);
  for(var i=0;i<num;i++) {
    str += ' ';
  }
  return str;
};

exports.doesFileExist = function(filename) {
  return fs.open(filename,'r',function(err,fd) {
    if(err) {
      console.log('false');
      return false;
    } else {
      console.log('true');
      return true;
    }
  });
};
