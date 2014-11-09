var fs = require('fs');
var yaml = require('js-yaml');
var sys = require('sys');
var exec = require('child_process').exec;


var configFile = "lifter.yml";

// yaml parsing
// var settings;
// fs.readFile(configFile, function (err, data) {
//   if (err) throw err;
//   settings = yaml.safeLoad(data);
//   console.log(JSON.stringify(settings));
// });



// if (!hostsWritten) {
//   exec('sudo ', function(error, stdout, stderr) {
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + stderr);
//   if (error) {
//     console.log('exec error: ' + error);
//   }
// });
// }

// boot2docker info
// error in run: Failed to get machine "boot2docker-vm": machine not exist
// check if 
var start_b2d = function() {
  exec('boot2docker info', function(err, stdout, stderr) {
    if (err) {
      if (/machine not exist/.test(stderr)) {
        console.log('VM not installed, running boot2docker init');
        // console.log(stderr);
        exec_b2d_init();
      } else {
        boot_b2d();
      }
    }
  });
};

var exec_b2d_init = function() {
  var hosts = fs.readFileSync('/etc/hosts');
  var hostsWritten = /dockerhost/.test(hosts);

  exec('boot2docker init', function(err, stdout, stderr) {
    if (err) console.log(stderr);
    console.log('weeeeee you gots a VM, dawg!');
    boot_b2d();
  });
};

// If b2d is powered off, power it on
var boot_b2d = function() {
  exec('boot2docker info | grep State', function (err, stdout, stderr) {
    if (err) console.log(err);
    if (/poweroff/.test(stdout)) {
      exec_b2d_Up();
    } else if (/running/.test(stdout)) {
      
    }
  });
}

var exec_b2d_Up = function() {
  var setEnvs = false;
  var exportCmds = [];
  exec('boot2docker up', function(err, stdout, stderr) {
    if (err) console.log("exec err: ", err);

    // check for boot2docker env vars
    if (!process.env.DOCKER_HOST ||
        !process.env.DOCKER_CERT_PATH ||
        !process.env.DOCKER_TLS_VERIFY) {
      setEnvs = true;
      // parse out EXPORT commands
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
    console.log("cmds:", cmds);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (setEnvs) setEnvironmentVars(exportCmds);
    
  });
};

var setEnvironmentVars = function(exportCmds) {
// set environment variables if necessary
  exportCmds.forEach(function(cmd) {
    exec(cmd, function(err,stdout,stderr) {
      console.log("EXECUTING", cmd);
      if (err) console.log("exec err: ", stderr);
      console.log(stdout);
    });
  });
}

// start_b2d();

module.exports = {
  start_b2d: start_b2d
}
