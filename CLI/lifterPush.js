
var exec = require('child_process').exec;
var yaml = require('../node_modules/js-yaml');
var fs = require('fs');

/*** 

lifterCommit currently assumes its within the root of the app container.

***/

// Read YML file and return contents
var readYML = function() {
  var content = fs.readFileSync('lifter.yml', {encoding: 'utf-8'});
  var ymlContents = yaml.safeLoad(content);
  return ymlContents;
}

// Copy mounted volume into a directory called "app"
var copyMounted = function() {

  // src is where the mounted files exist
  // app is where the copied files will be transeffered to
  var content = readYML();
  var command = 'docker exec -i -t ' + content.containerName +' cp -r src/ /app';
    
  exec(command, function(err, stdout, stderr){
    if(err){ 
      console.log("ERR: ", stderr);
    } else {
      console.log("Files were copied into /app")
    }
  });
}


// var commitImage = function() {

//   var container = ymlContents.containerName;
//   var repo = ymlContents.repoName;

//   copyMounted();

//   var command = 'docker commit ' + container + ' ' + repo + ' :latest';
  
//   console.log("COMMAND", command);

//   // exec(command, function(err, stdout, stderr){
//   //   if(err){ 
//   //     console.log("ERR: ", stderr);
//   //   } else {
//   //     console.log("Image was commited");
//   //   }
//   // });
// }


// commitImage();