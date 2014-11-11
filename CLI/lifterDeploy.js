var exec = require('child_process').exec;

//check if user has xplat-cli installed
var checkAzure = function(){
  exec('npm list -g --depth=0 | grep azure-cli', function(err, stdout, stderr){
    if(/azure-cli/.test(stdout)) {
      console.log("Azure-CLI found");
    } else {
      console.log("Exiting lifter...please install the azure command line tool: npm install -g azure-cli");
    }
  });
}

checkAzure();