var exec = require('child_process').exec;
var prompt = require('../node_modules/prompt');
var vmSetupQuestions = require('./vmSetup.js');


//check if user has azure-cli installed - #81
var checkAzure = function(){
  exec('npm list -g --depth=0 | grep azure-cli', function(err, stdout, stderr){
    if(/azure-cli/.test(stdout)) {
      console.log("Azure-CLI found, opening Azure Management Portal in default browser...".green);
      checkSubscription();
    } else {
      console.log("Exiting lifter...\n\nPlease install the azure command line tool and rerun lifter deploy:\nnpm install -g azure-cli".white);
    }
  });
}

//check if azure subscription is connected
var checkSubscription = function() {
  exec('azure account show', function(err, stdout, stderr){
    if(/There is no current subscription/.test(stdout)){
      console.log("Azure subscription not connected");
      loginAzure();
    } else {
      setupAzureVM();
    }
  });
}

//ask the user to login to azure and connect their subscription
var loginAzure = function() {
  exec('azure account download', function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", err);
    } else {
      console.log("Please complete the following before continuing\n\n1. Sign into the Azure Management Portal in the browser that was opened\n2. A .publishsettings file will be downloaded, remember its location\n3. Run the following command: azure account import .publishsettings < .publishsettings file location>\n 4.Rerun lifter deploy".white);
    }
  });
}


//asks user to create vm credentials and grabs ubuntu image
var setupAzureVM = function() {

  var ubuntuImage = "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04-LTS-amd64-server-20140724-en-us-30GB";
  
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(vmSetupQuestions.vmSetup, function(err,result){
    credentials = [result.vm, result.username, result.password];
    createAzureVM(ubuntuImage, credentials);
  });
}


//create an Azure VM with the Ubuntu image
var createAzureVM = function(img, creds) {

  var command = 'azure vm docker create -e 22 -l "West US" '+ creds[0] +' "' + img + '" ' + creds[1] + ' ' + creds[2];

  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", err);
    } else {
      console.log("VM created");
    }
  });
}

checkAzure();
