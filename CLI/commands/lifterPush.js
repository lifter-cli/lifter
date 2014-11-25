var fs = require('fs');
var exec = require('child_process').exec;
var yaml = require('../../node_modules/js-yaml');
var helper = require('../helpers/helpers.js');

// copies the mounted volume (from /src) into a new directory(/prod)
var copyMounted = function() {
  console.log('Copying source code into container');

  var yamlContent = helper.readYAML();
  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var command = 'docker exec ' + yamlContent.containerName +' cp -r src/ /prod';
  exec(command, function(err, stdout, stderr){
    if(err){
      console.log("ERR: ", stderr);
    } else {
      console.log("Source code copied: /prod");
      console.log('Commiting changes to container...');
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
      console.log("Pushing changes to Docker Hub...");
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
      console.log("Your container's latest state is now on Docker Hub.\nType 'lifter deploy' to deploy your application containers.");
    }
  });
};

module.exports = {
  copyMounted: copyMounted
}


