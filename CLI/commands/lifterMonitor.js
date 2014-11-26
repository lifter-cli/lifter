var exec = require('child_process').exec;

// copies the mounted volume (from /src) into a new directory(/prod)
var start = function() {
  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var command = __dirname + '/../../lifter-ui/run-lifter-ui.sh:';
  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", stderr);
    } else {
      console.log("Launched lifter container. Go to http://localhost:3123");
    }
  });
};

module.exports = {
  start: start
};
