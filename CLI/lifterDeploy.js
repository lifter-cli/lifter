var exec = require('child_process').exec;
var prompt = require('../node_modules/prompt');
var vmSetupQuestions = require('./vmSetup.js');


var username = "yaml-user";
var password = "yaml-pswd";
var vmName = "myVM";

// //check if user has azure-cli installed - #81
// var checkAzure = function(){
//   exec('npm list -g --depth=0 | grep azure-cli', function(err, stdout, stderr){
//     if(/azure-cli/.test(stdout)) {
//       console.log("Azure-CLI found, opening Azure Management Portal in default browser...".green);
//       loginAzure();
//     } else {
//       console.log("Exiting lifter...\n\nPlease install the azure command line tool and rerun lifter deploy:\nnpm install -g azure-cli".white);
//     }
//   });
// }

// //check if azure subscription is connected
// var checkSubscription = function() {
//   exec('azure account show', function(err, stdout, stderr){
//     if(/There is no current subscription/.test(stdout)){
//       console.log("Azure subscription not connected");
//       loginAzure();
//     } else {
//       setupAzureVM();
//     }
//   });
// }

// //ask the user to login to azure and connect their subscription
// var loginAzure = function() {
//   exec('azure account download', function(err, stdout, stderr){
//     if(err){
//       console.log("ERR: ", err);
//     } else {
//       console.log("Please complete the following before continuing\n\n1. Sign into the Azure Management Portal in the browser that was opened\n2. A .publishsettings file will be downloaded, remember its location\n3. Run the following command: azure account import .publishsettings < .publishsettings file location>\n 4.Rerun lifter deploy".white);
//       checkSubscription();
//     }
//   });
// }


var setupAzureVM = function() {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();
  prompt.get(vmSetupQuestions.vmSetup, function(err,result){
    console.log("\nYour vm name: ", result.vm);
    console.log("Your username: ", result.username);
    console.log("Your password: ", result.password);
  });


  //call getUbuntuImage();
}

setupAzureVM();

//find an UbuntuImage for the VM
// var getUbuntuImage = function() {
//   exec('azure vm image list | grep Ubuntu-14_04', function(err, stdout, stderr){
//     if(err){
//       console.log("ERR: ", err);
//     } else {
//       var img = stdout;
//       img = img.split("Public")[0];
//       img = img.split(" ");
//       img = img.filter(function(item){
//         if(item !== '' && item !== 'data:'){
//           return item;
//         }
//       });
//       img = img.join();
//       createAzureVM(img);
//     }
//   });
// }


//create an Azure VM with the Ubuntu image
//var createAzureVM = function(image) {


  // var command = 'azure vm docker create -e 22 -l "West US"'+ vmName +' "' + image + '" ' + username + ' ' + password;

  // exec(command, function(err, stdout, stderr){
  //   if(err){
  //     console.log("ERR: ", err);
  //   } else {
  //     console.log("VM created");
  //     checkForDocker();
  //   }
  // });
//}

//checks if docker is installed inside the vm
// var checkForDocker = function() {

//   var command = 'ssh '+ username +'@vm-cloud-service-name.cloudapp.net';

//   exec(command, function(err, stdout, stderr){
//     if(err){
//       console.log("ERR: ", err);
//     } else {
//       console.log("Check if docker was installed");
//     }
//   });
// }

//checkAzure();
