var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;

/**
* Function that takes in an array of tasks that will be individually
*   passed to the spawn function, then runs each task in series. At the 
*   end of all the tasks, a final callback will be invoked.
* @function
* @memberof module:helpers
* EXAMPLE
*   spawnSeries([
*    ['ls', ['-lh', '/usr']],
*    ['ls', ['-la']]
*   ], function() { console.log('all done!'); });
*/
var spawnSeries = function(tasks, callback) {
  callback = callback || function() {};
  var completed = 0;
  var iterate = function() {
    if (++completed < tasks.length) {
      run();
    } else {
      callback();
    }
  }
  var run = function() {
    var task = tasks[completed];
    console.log("RUNNING:", task);
    var proc = spawn.apply(null, task);
    proc.stdout.on('data', function(data) {
      console.log(data.toString());
    });
    proc.stderr.on('data', function(data) {
      console.log(data.toString());
    });
    proc.on('exit', function(code) {
      // console.log('EXIT CODE:', code);
      iterate();
    });
  }
  run();
}


/**
* Function that takes in an array of docker commands that will be  
*   have docker default parameters mapped to them, so they can 
*   properly communicate with the boot2docker VM, then runs each 
*   task in series. 
*   At the end of all the tasks, a final callback will be invoked.
* @function
* @memberof module:helpers
*/
// EXAMPLE
// dockerSpawnSeries([
//   ['docker', ['pull', 'ubuntu:latest']],
//   ['docker', ['-v']]
// ]);
var dockerSpawnSeries = function(commands, callback) {
  callback = callback || function() {};
  getDockerDefaults(function(defaults) {
    commands.map(function(command) {
      command[1] = defaults.concat(command[1]);
    });
    spawnSeries(commands, callback);
  })
}

var getDockerDefaults = function(callback) {
  exec('boot2docker shellinit', function(err, stdout, stderr) {
    parseDefaults(stdout.split('\n'), callback);
  });
}

var parseDefaults = function(arr, callback) {
  var defaults = ['--tlsverify'];
  arr.forEach(function(val) {
    var param = val.trim().split('=');
    if (param[0] === 'export DOCKER_HOST') {
      defaults.push('-H');
      defaults.push(param[1]);
    } else if (param[0] === 'export DOCKER_CERT_PATH') {
      defaults.push('--tlscacert="' + param[1] + '/ca.pem"');
      defaults.push('--tlscert="' + param[1] + '/cert.pem"');
      defaults.push('--tlskey="' + param[1] + '/key.pem"');
    }
  });
  callback(defaults);
}

module.exports = {
  spawnSeries: spawnSeries,
  dockerSpawnSeries: dockerSpawnSeries
}
