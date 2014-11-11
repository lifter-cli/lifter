exports.addSpace = function(str,num) {
  console.log(num);
  for(var i=0;i<num;i++) {
    str += ' ';
  }
  return str;
};