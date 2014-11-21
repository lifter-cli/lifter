/**
* @module helpers
*/
var fs = require('fs');
var yaml = require('../../node_modules/js-yaml');
var configFile = '../../.lifter/lifter.yml';

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
  readYAML: readYAML,
  configFile: configFile
}