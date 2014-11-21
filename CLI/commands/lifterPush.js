var fs = require('fs');
var exec = require('child_process').exec;
var yaml = require('../../node_modules/js-yaml');
var helper = require('../helpers/helpers.js');

// copies the mounted volume (from /src) into a new directory(/prod)
var copyMounted = function() {
  var yamlContent = helper.readYAML();
  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var command = 'docker exec -i -t ' + yamlContent.containerName +' cp -r src/ /prod';
  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", stderr);
    } else {
      console.log("Files were copied into /prod");
      commitImage();
    }
  });
};

// commits changes and creates a docker image
var commitImage = function() {
  var yamlContent = helper.readYAML();
  var command = 'docker commit ' + yamlContent.containerName + ' ' + yamlContent.username + '/' + yamlContent.repoName + ':latest';
  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", stderr);
    } else {
      console.log("Image was commited");
      pushImage();
    }
  });
};

// pushes docker image to docker hub
var pushImage = function() {
  var yamlContent = helper.readYAML();
  var command = 'docker push ' + yamlContent.username + '/' + yamlContent.repoName + ':latest';
  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", stderr);
    } else {
      console.log("Image was commited");
    }
  });
};

module.exports = {
  copyMounted: copyMounted
}


