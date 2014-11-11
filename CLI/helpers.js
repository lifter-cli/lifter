var fs = require('fs');

exports.addSpace = function(str,num) {
  console.log(num);
  for(var i=0;i<num;i++) {
    str += ' ';
  }
  return str;
};

exports.doesYMLExist = function(filename) {
  return fs.open(file,'r',function(err,fd) {
    if(err) {
      return false;
    } else {
      return true;
    }
  });
};
