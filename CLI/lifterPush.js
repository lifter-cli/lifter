var exec = require('child_process').exec;
var yaml = require('../node_modules/js-yaml');
var fs = require('fs');
// console.log("INSIDE lifter push");
/*** 

lifterPush currently assumes its within the root of the app container.

***/

// Read YML file and return contents
var readYML = function() {
  var content = fs.readFileSync('lifter.yml', {encoding: 'utf-8'});
  var ymlContents = yaml.safeLoad(content);
  return ymlContents;
}

var content = readYML();
var container = content.containerName;
var repo = content.repoName;
var username = content.username;

// Copy mounted volume into a directory called "app"
exports.copyMounted = function() {

  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var command = 'docker exec -i -t ' + container +' cp -r src/ /prod';
    
  exec(command, function(err, stdout, stderr){
    if(err){ 
      console.log("ERR: ", stderr);
    } else {
      console.log("Files were copied into /prod");
      commitImage();
    }
  });
}

// Commit docker image
var commitImage = function() {

  var command = 'docker commit ' + container + ' ' + repo + ':latest';
  
  exec(command, function(err, stdout, stderr){
    if(err){ 
      console.log("ERR: ", stderr);
    } else {
      console.log("Image was commited");
      pushImage();
    }
  });
}

// Push image to docker hub
var pushImage = function() {

  var command = 'docker push ' + username + '/' + repo + ':latest';
  
  exec(command, function(err, stdout, stderr){
    if(err){ 
      console.log("ERR: ", stderr);
    } else {
      console.log("Image was commited");
    }
  });
}




