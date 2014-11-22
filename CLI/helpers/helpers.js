/**
* @module helpers
*/
var fs = require('fs');
var yaml = require('../../node_modules/js-yaml');
var configFile = '../../.lifter/lifter.yml'

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
* Function that reads the lifter.yml file
* @function
* @memberof module:helpers
*/

var readYAML = function() {
  var out;
  try {
    var content = fs.readFileSync(configFile);
    out = yaml.safeLoad(content);
  } catch (e) {
    console.log(e.code, e.path);
    if (e.code === 'ENOENT') {
      console.log('... config file does not exist, please run lifter config');
    }
    process.exit();
  }
  return out;
}

module.exports = {
  spawnSeries: spawnSeries,
  readYAML: readYAML,
  configFile: configFile
}