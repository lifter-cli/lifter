var fs = require('fs');
var yaml = require('js-yaml');
var exec = require('child_process').exec;
var builder = require('./buildContainer.js');
var configFile = "lifter.yml";

// execsync may or may not be useful at some point
// var execSync = require('exec-sync');

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
      console.log('boot2docker VM exists, checking to see if running...');
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
    if (/poweroff/.test(stdout)) {
      exec_b2d_Up();
    } else { // if (/running/.test(stdout)) {
      console.log('boot2docker is already running');
      checkHostsFileForDockerhost();
      // TODO: what goes here?
    }
  });
}

var exec_b2d_Up = function() {
  var setEnvs = false;
  var exportCmds = [];
  exec('boot2docker up', function(err, stdout, stderr) {
    if (err) console.log("exec err: ", err);
    console.log('boot2docker VM powered on')
    // check for boot2docker env vars
    if (!process.env.DOCKER_HOST ||
        !process.env.DOCKER_CERT_PATH ||
        !process.env.DOCKER_TLS_VERIFY) {
      setEnvs = true;
      // parse out EXPORT commands
      console.log("environment variables not set... parsing commands and running")
      var cmds = stdout;
      cmds = cmds.split("To connect the Docker client to the Docker daemon, please set:")[1];
      cmds = cmds.replace( /\n/g, "#").split("#");
      cmds = cmds.filter(function(item){
        return item !== '';
      });
      cmds = cmds.map(function(value) {
        return value.trim();
      });
      exportCmds = cmds;
    }

    // set environment variables if necessary, 
    // or check if dockerhost is IP correct
    if (setEnvs) {
      setEnvironmentVars(exportCmds);
    } else {
      checkHostsFileForDockerhost();
    }
    
  });
};

var setEnvironmentVars = function(exportCmds) {
  exportCmds.forEach(function(cmd) {
    exec(cmd, function(err,stdout,stderr) {
      console.log("Executing:", cmd);
      // if (err) console.log("exec err: ", stderr);
    });
  });
  checkHostsFileForDockerhost();
}

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
    builder.buildDockerFile();
    

    if (hostsWritten) {
      console.log('dockerhost found in /etc/hosts');
      if (!ipRegex.test(hosts)) {
        console.log('dockerhost IP incorrect... removing');
        // removeIPinHostsFile(ip);
        exitInstructions.push(
          'sed \'/dockerhost/d\' /etc/hosts | sudo tee /etc/hosts');
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
    finishInit();
  });
    
}

// add dockerhost IP in /etc/hosts when not present
var addDockerhostToHostsFile = function(ip) {
  var cmd = 'echo ' + ip + ' dockerhost | sudo tee -a /etc/hosts';
  // TODO: prompt user to confirm execution of this command
  exec(cmd, function(err, stdout, stderr) {
    if (err) console.log(stderr);
    console.log("dockerhost IP added to /etc/hosts");
    // console.log("STDOUT:",stdout);
  });
}

// remove dockerhost IP in /etc/hosts when incorrect
var removeIPinHostsFile = function(ip){
  var cmd = 'sed \'/dockerhost/d\' /etc/hosts | sudo tee /etc/hosts';
  // TODO: prompt user to confirm execution of this command
  exec(cmd, function(err, stdout, stderr) {
    // if (err) console.log(stderr);
    console.log("incorrect IP removed from /etc/hosts");
    addDockerhostToHostsFile(ip);
  });
}

// create shell script to launch app
var createShellScript = function() {
  if(!fs.existsSync(configFile)) {
    console.log('lifter.yml doesn\'t exist. Please run lifter config');
    process.exit(1);
  }

  fs.readFile(configFile, function (err, data) {
    if (err) throw err;
    settings = yaml.safeLoad(data);

    var shellFileContent = "#!/bin/sh\n";
    shellFileContent += "cd " + settings.launchPath + "\n";
    shellFileContent += settings.launchCommand;

    fs.writeFile("app.sh", shellFileContent, function(err) {
      if (err) console.log(err);
      console.log("Launch script created: app.sh");
    });
  });
}

var finishInit = function () {
  console.log("Program container(s) initialized.");
  if (exitInstructions.length > 0) {
    console.log("Run these commands:")
    exitInstructions.forEach(function(str) {
      console.log("    " + str);
    });
  }
}
// builder.buildDockerFile();
// createShellScript();
start_b2d();
// removeIPinHostsFile("192.123.123.42");
// checkHostsFileForDockerhost();

module.exports = {
  start_b2d: start_b2d
}
