var helpers = require('../helpers/helpers.js');

var printCommand = function() {
  var settings = helpers.readYAML();
  var cmd = '$(boot2docker shellinit) && docker exec -it ' + settings.containerName + ' bash';
  console.log('To enter your container, execute this line:');
  console.log('\n    ' + cmd + '\n');
}

module.exports = {
  printCommand: printCommand
}