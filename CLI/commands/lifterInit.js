var fs = require('fs');
var aync = require('async');
var exec = require('child_process').exec;
var helpers = require('../helpers/helpers.js');
var builder = require('../helpers/dockerfileBuilder.js');
var spawnSeriesLib = require('../helpers/spawnSeries.js');
var dockerSpawnSeries = spawnSeriesLib.dockerSpawnSeries;
var configFile = "./.lifter/lifter.yml";

var exitInstructions = [];

// if boot2docker VM doesn't exist: init , else boot
var start_b2d = function() {
  exec('boot2docker info', function(err, stdout, stderr) {
    if (err) {
      if (/machine not exist/.test(stderr)) {
        console.log('boot2docker VM not installed, running boot2docker init');
        exec_b2d_init();
      }
    } else {
      boot_b2d();
    }
  });
};

// create boot2docker VM, then boot
var exec_b2d_init = function() {
  exec('boot2docker init', function(err, stdout, stderr) {
    if (err) console.log(stderr);
    console.log('boot2docker VM created!');
    boot_b2d();
  });
};

// If b2d is powered off, power it on
var boot_b2d = function() {
  exec('boot2docker status', function (err, stdout, stderr) {
    if (err) console.log(err);
    if (/running/.test(stdout)) {
      console.log('boot2docker is already running');
      finishInit();
    } else { //if (/poweroff/.test(stdout)) {
      console.log('boot2docker not running, powering on...');
      exec_b2d_Up();
    }
  });
}

var exec_b2d_Up = function() {
  var setEnvs = false;
  var exportCmds = [];
  exec('boot2docker up', function(err, stdout, stderr) {
    if (err) console.log("exec err: ", err);
    console.log('boot2docker VM powered on');
    finishInit();
  });
};

// check /etc/hosts for proper dockerhost IP
var checkHostsFileForDockerhost = function() {
  var hosts = fs.readFileSync('/etc/hosts');
  var hostsWritten = /dockerhost/.test(hosts);

  exec('boot2docker ip', function(err, stdout, stderr) {
    if (err) console.log(stderr);
    // grab ip out of stdout
    var ip = /\d*\.\d*\.\d*\.\d*/.exec(stdout)[0];
    var ipRegex = new RegExp(ip);
    // change line if ip not in hosts file

    createShellScript();
    builder.buildDockerfile();

    if (hostsWritten) {
      console.log('dockerhost found in /etc/hosts');
      if (!ipRegex.test(hosts)) {
        console.log('dockerhost IP incorrect... removing');
        // removeIPinHostsFile(ip);
        exitInstructions.push(
          'echo sed \'/dockerhost/d\' /etc/hosts | sudo tee /etc/hosts');
        exitInstructions.push(
          'echo ' + ip + ' dockerhost | sudo tee -a /etc/hosts');
      } else {
        console.log('dockerhost IP is correct');
      }
    } else {
      console.log('dockerhost not found in /etc/hosts... adding');
      exitInstructions.push(
          'echo ' + ip + ' dockerhost | sudo tee -a /etc/hosts');
      // addDockerhostToHostsFile(ip);
    }
    // console.log(exitInstructions);
    createLocalContainer();
  });

}

// create shell script to launch app
var createShellScript = function() {
  var settings = helpers.readYAML();

  var shellFileContent = '#!/bin/sh\n' +

                         // wait 10 seconds for containers to be configured
                         'sleep 10\n' +

                         'DB_PORT=' + settings.dbPort + "\n" +
                         'CURL_OUTPUT=$(curl dbLink:$DB_PORT)\n' +
                         // this success message is  specific to mongo, need to change
                         'SUCCESS="It looks like you are trying to access MongoDB over HTTP on the native driver port."\n' +
                         'LAUNCH_CMD="' + settings.launchCommand + '"\n' +

                         // checking if application and database container are linked
                         'until [[ $CURL_OUTPUT == $SUCCESS ]]\n' +
                         // if they are not, waits 20seconds and checks again
                         'do\n' +
                         'echo "Linking database container"\n' +
                         'sleep 20\n' +
                         'CURL_OUTPUT=$(curl dbLink:$DB_PORT)\n' +
                         // otherwise it runns the launch command
                         'done\n' +
                         'echo "Containers linked, running application launch command"\n' +
                         'cd prod\n' +
                         '$LAUNCH_CMD';

  fs.writeFile("./.lifter/app.sh", shellFileContent, function(err) {
    if (err) console.log(err);
    console.log("Launch script created: app.sh");
  });
}


var createLocalContainer = function() {
  var settings = helpers.readYAML();
  //docker build -t username_on_docker_hub/create_new_repo_name .
  var appContainerName = settings.appContainerName;
  var imageName = settings.username + '/' + settings.repoName;

  var dbContainerName = settings.dbContainerName;
  var dbImageName = settings.dbTag;
  var dbLinkName = dbContainerName+'-link';

  var buildCmd = ['docker', 
    ['build', '-t', imageName, '.']];
  var dbRunCmd = ['docker', 
    ['run', '--restart=always', '-d', 
     '--name', dbContainerName, dbImageName]];
  var appRunCmd = ['docker', 
    ['run', '--restart=always', 
     '--name', appContainerName, 
     '--link', dbContainerName+':'+dbLinkName,
     '-p', settings.portPrivate+':'+settings.portPublic, 
     '-v', settings.launchPath+':/src:ro', imageName, 'sh', '/src/app.sh']];

  dockerSpawnSeries([
    buildCmd,
    dbRunCmd,
    appRunCmd
  ], finishInit);
}

var printInstructions = function() {
  if (exitInstructions.length > 0) {
    console.log("Run these commands:")
    exitInstructions.forEach(function(str) {
      console.log("    " + str);
    });
  }
}

var finishInit = function () {
  aync.series([
    checkHostsFileForDockerhost,
    createShellScript,
    createLocalContainer
  ]);
  console.log('Local docker environment created!');
  printInstructions();
}

module.exports = {
  start_b2d: start_b2d
}
