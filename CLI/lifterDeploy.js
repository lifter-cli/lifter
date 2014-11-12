var exec = require('child_process').exec;
var prompt = require('../node_modules/prompt');

//check if user has xplat-cli installed
var checkAzure = function(){
  exec('npm list -g --depth=0 | grep azure-cli', function(err, stdout, stderr){
    if(/azure-cli/.test(stdout)) {
      console.log("Azure-CLI found, opening Azure Management Portal in default browser...".green);
      loginAzure();
    } else {
      console.log("Exiting lifter...please install the azure command line tool: npm install -g azure-cli".white);
    }
  });
}

//ask the user to set up azure login
var loginAzure = function() {
  exec('azure account download', function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", err);
    } else {
      console.log("Please complete the following before continuing\n\n1. Sign into the Azure Management Portal in the browser that was opened\n2. A .publishsettings file will be downloaded, remember its location\n3. Run the following command: azure account import .publishsettings <.publishsettings file location>".white);
      // getUbuntuImage();
    }
  });
}

checkAzure();
