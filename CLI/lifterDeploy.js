var fs = require('fs');
var exec = require('child_process').exec;
var prompt = require('../node_modules/prompt');
var vmSetupQs = require('./vmSetup.js');
var yaml = require('../node_modules/js-yaml');

//check if user has azure-cli installed - #81
exports.checkAzure = function(){
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
      whichVM();
    }
  });
}

//asks users if they are deploying to a new vm or to an existing one
var whichVM = function(){
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(vmSetupQs.existingOrNew, function(err, result){
    if(result.select === "existing"){
      getVMInfo();
    } else if (result.select === "new"){
      setupAzureVM();
    }
  });
}

//asks user for their vm name and vm username, appends info to YAML file
var getVMInfo = function(){
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(vmSetupQs.vmInfo, function(err, result){

    if(err){
      console.log("ERR: ", err);
    }

    var toAppend = "\nvmName: " + result.vmName + "\nvmUsername: " + result.vmUsername;

    fs.appendFile('lifter.yml', toAppend,function(err){
      if(err) {
        console.log(err);
      } else {
        console.log("Writing deploy script...");
        // readYML();
      }
    });
  });
}

//ask the user to login to azure and connect their subscription
var loginAzure = function() {
  exec('azure account download', function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", err);
    } else {
      console.log("Please complete the following before continuing\n\n"+
      "1. Sign into the Azure Management Portal in the browser that was opened\n"+
      "2. A .publishsettings file will be downloaded, remember its location\n"+
      "3. Run the following command: azure account import .publishsettings < .publishsettings file location>\n"+
      "4. Rerun lifter deploy".white);
    }
  });
}

//asks user to create vm credentials and grabs ubuntu image
var setupAzureVM = function() {
  
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(vmSetupQs.vmSetup, function(err,result){
    credentials = [result.vm, result.username, result.password];
    createAzureVM(credentials);
  });
}

//create an Azure VM with the Ubuntu image
var createAzureVM = function(creds) {

  var ubuntuImage = "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04-LTS-amd64-server-20140724-en-us-30GB";
  var command = 'azure vm docker create -e 22 -l "West US" '+ creds[0] +' "' + ubuntuImage + '" ' + creds[1] + ' ' + creds[2];

  exec(command, function(err, stdout, stderr){
    if(err){
      if(/The specified DNS name is already taken|already exists/.test(stderr)){
        console.log(('A VM with the dns "' + creds[0] + '" already exists.').red);
        setupAzureVM();
      } else {
        console.log("ERR: ", err);
      }
    } else {
      console.log('Azure VM "'+ creds[0] + '" created');
      console.log("Writing deploy script...");
      // readYML();
    }
  });
}
