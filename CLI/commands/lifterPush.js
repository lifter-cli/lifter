var yaml = require('../../node_modules/js-yaml');
var helper = require('../helpers/helpers.js');
var docker = require('../helpers/dockerLib.js');


var runLifterPush = function() {
  var yamlContent = helper.readYAML();
  
  // copies the mounted volume (from /src) into a new directory(/prod)
  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var copy = ['docker', [
    'exec', yamlContent.containerName, 
    'cp', '-r', 'src/', '/prod'
  ]];

  // commits changes and creates a docker image
  var commit = ['docker', [
    'commit', yamlContent.containerName, 
    yamlContent.username+'/'+yamlContent.repoName+':latest'
  ]];

  // pushes docker image to docker hub
  var push = ['docker', [
    'push', yamlContent.username+'/'+yamlContent.repoName+':latest'
  ]];

  docker.spawnSeries([
    copy,
    commit,
    push
  ], function() {
    console.log("Your container's latest state is now on Docker Hub.\nType 'lifter deploy' to deploy your application containers.");
  });
}


module.exports = {
  copyMounted: runLifterPush
}


