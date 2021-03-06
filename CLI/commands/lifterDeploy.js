var fs = require('fs');
var exec = require('child_process').exec;
var prompt = require('../../node_modules/prompt');
var vmSetupQs = require('../prompts/vmSetup.js');
var yaml = require('../../node_modules/js-yaml');
var helper = require('../helpers/helpers.js');

//checks if user has azure-cli installed
var checkAzure = function(){
  exec('npm list -g --depth=0 | grep azure-cli', function(err, stdout, stderr){
    if(/azure-cli/.test(stdout)) {
      console.log('Azure-CLI found, checking subscription connection...'.green);
      checkSubscription();
    } else {
      console.log('Exiting lifter...\n\nPlease install the azure command line tool and rerun lifter deploy:\nnpm install -g azure-cli'.white);
    }
  });
}

//checks if azure subscription is connected
var checkSubscription = function() {
  exec('azure account show', function(err, stdout, stderr){
    if(/There is no current subscription/.test(stdout)){
      console.log('Azure subscription not connected');
      loginAzure();
    } else {
      console.log('Subscription connected');
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
    if(result.select === 'existing'){
      getVMInfo();
    } else if (result.select === 'new'){
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
      console.log('ERR: ', err);
    } else {
      helper.sendVMInfoToYAML(result.vmName, result.vmUsername, writeDeployScript);
    }
  });
}

// asks user to login to azure and connect their subscription
var loginAzure = function() {
  exec('azure account download', function(err, stdout, stderr){
    if(err){
      console.log('ERR: ', err);
    } else {
      console.log('Please complete the following before continuing\n\n'+
      '1. Sign into the Azure Management Portal in the browser that was opened\n'+
      '2. A .publishsettings file will be downloaded, remember its location\n'+
      '3. Run the following command: azure account import .publishsettings < .publishsettings file location>\n'+
      '4. Rerun lifter deploy'.white);
    }
  });
}

// asks user to create vm credentials
var setupAzureVM = function() {

  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(vmSetupQs.vmSetup, function(err,result){
    credentials = [result.vm, result.username, result.password];
    // Creating new line to avoid over-writing the previous line
    console.log('\nCreating azure vm...');

    createAzureVM(credentials);
  });
}

// creates an Azure VM with an Ubuntu image
var createAzureVM = function(creds) {

  var ubuntuImage = 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04-LTS-amd64-server-20140724-en-us-30GB';
  var command = 'azure vm docker create -e 22 -l "West US" '+ creds[0] +' "' + ubuntuImage + '" ' + creds[1] + ' ' + creds[2];

  exec(command, function(err, stdout, stderr){
    if(err){
      if(/The specified DNS name is already taken|already exists/.test(stderr)){
        console.log(('A VM with the dns "' + creds[0] + '" already exists.').red);
        setupAzureVM();
      } else {
        console.log('ERR: ', err);
      }
    } else {
      console.log('Azure VM "'+ creds[0] + '" created');
      helper.sendVMInfoToYAML(creds[0], creds[1], writeDeployScript);
    }
  });
}


// writes deploy script for vm
var writeDeployScript = function(){

  var yamlContent = helper.readYAML();

  var app = yamlContent.containerName;
  var appImage = yamlContent.username+ '/' +yamlContent.repoName+ ':latest';

  var pub = yamlContent.portPublic;
  var priv = yamlContent.portPrivate;

  var runContainerCMDS;

  // checks if user is creating a db container
  if(yamlContent.dbPort !== null){
    var db = yamlContent.dbContainerName;
    var dbImage = yamlContent.dbTag;
    var dbLink = db + '-link';

    runContainerCMDS = 'echo "Starting database container"\n' +
                       'sudo docker $DOCKER_OPTS run -d --name ' +db+ ' ' +dbImage+ '\n' +
                       'echo "Linking to database container"\n' +
                       'echo "Running application script"\n' +
                       'sudo docker $DOCKER_OPTS run --name ' +app+ ' -it -p ' +pub+ ':' +priv+ ' --link ' +db+ ':' +dbLink+ ' ' +appImage+ ' sh prod/.lifter/app.sh\n';
  } else {
    runContainerCMDS = 'echo "Running application script"\n' +
                       'sudo docker $DOCKER_OPTS run --name ' +app+ ' -it -p ' +pub+ ':' +priv+ ' ' +appImage+ ' sh prod/.lifter/app.sh\n';
  }

  var deployScript = 'cat /etc/default/docker.io | sed \'s/0.0.0.0/localhost/g\' | sed \'s/tlsverify/tls/\' | sudo tee /etc/default/docker.io\n' +

                     'export DOCKER_OPTS="$(cat /etc/default/docker.io | grep DOCKER_OPTS | sed \'s/DOCKER_OPTS=//\' | sed \'s/\\\"//g\')"\n' +

                     'sudo service docker.io restart\n' +

                     'echo "Pulling image from DockerHub"\n' +
                     'sudo docker $DOCKER_OPTS pull ' +appImage+ '\n' +

                     'echo "Shutting down existing application container (if one exists)"\n' +
                     'sudo docker $DOCKER_OPTS rm -f ' +app+ '\n' +

                     runContainerCMDS +

                     'echo "Before you can access your deployed application, you must open the following port: ' +pub+ '"\n' +
                     'echo "Please follow the instructions at:"\n' + 
                     'echo "http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-set-up-endpoints/"\n' +
                     'echo "It may take a few minutes for your vm endpoints to be configured."\n' +
                     'echo "After your endpoints have been configure, your application will be deployed at: http://' +yamlContent.vmName+ '.cloudapp.net:' +pub+ '"';
  

  fs.writeFile('./.lifter/deploy.sh', deployScript, function (err) {
    if (err) {
      console.log('Err deploy script not written: ', err);
    }
    console.log('Created deploy script: deploy.sh');
    console.log('Checking vm status...');
    checkVMStatus();
  });
};

// checks if vm is ready for ssh
var checkVMStatus = function() {

  var yamlContent = helper.readYAML();
  var command = 'azure vm show ' + yamlContent.vmName;

  exec(command, function(err, stdout, stderr){
    if(err){
      console.log('ERR: ', err);
    } else if(/"ReadyRole"/.test(stdout)){
      console.log('VM status is "Ready", ready to send deploy script');
      sendDeployScript();
    } else {
      console.log('VM not ready...retrying in 20 seconds')
      setTimeout(checkVMStatus, 20000);
    }
  });
}

// copies deploy script into vm
var sendDeployScript = function(){

  var yamlContent = helper.readYAML();
  var sshPath = yamlContent.vmUserName+ '@' +yamlContent.vmName+ '.cloudapp.net';

  console.log('\nPlease run the following commands:\n\n' +
              '1. Send the deploy script to your vm: scp ./.lifter/deploy.sh ' +sshPath+ ':/home/' +yamlContent.vmUserName+ '\n\n' +
              'You will be prompted for the vm\'s password after running this command. If this is your first time ssh-ing into the vm,\n'+
              'you will need to respond "yes" when asked to authenticate the host\n\n'+
              '2. ssh into your vm: ssh ' +sshPath+ '\n\n'+
              '3. Run the script inside your vm: sh deploy.sh\n');
}

module.exports = {
  checkAzure: checkAzure
}
