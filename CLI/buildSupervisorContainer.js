var fs = require('fs');
var path = require('path');
var yaml = require('../node_modules/js-yaml');

var SUPERVISOR_DIRNAME = 'super';
var globalDependencies = ['bower.json','karma.conf','README.md'];
var globalDependencyInstallCommands = {
'bower.json': ['RUN','yum install bower -g'],
'README.md': ['RUN','yum install -y yml'],
'karma.conf': ['RUN','yum install karma -g']
};

var dockerFileContents = [

['#','DOCKER-VERSION 0.3.4'],
['FROM'],
['MAINTAINER'],
['#','Enable EPEL for Node.js'],
['RUN', 'rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm'],

['#','Install Node.js, npm, and git, etc.'],
['RUN', 'yum install -y npm'],
['RUN', 'yum install -y git'],

['EXPOSE'],

];

var readYML = function() {
  var ymlContents = yaml.safeLoad(fs.readFileSync('lifter.yml',{encoding: 'utf-8'}));
  for(var i=0;i<dockerFileContents.length;i++) {

    if(dockerFileContents[i][0] === 'FROM') {
      dockerFileContents[i].push(ymlContents.linuxOS);
    }
    if(dockerFileContents[i][0] === 'MAINTAINER') {
      dockerFileContents[i].push(ymlContents.username);
    }
    if(dockerFileContents[i][0] === 'EXPOSE') {
      dockerFileContents[i].push(ymlContents.portPublic);
    }
  }
};

var readDirectory = function() {
  var dirContents = fs.readdirSync('./');
  for(var i=0;i<dirContents.length;i++) {
    if(globalDependencies.indexOf(dirContents[i]) > -1) {
      dockerFileContents.push(globalDependencyInstallCommands[dirContents[i]]);
    }
  }
};

var addSpace = function(str,num) {
  console.log(num);
  for(var i=0;i<num;i++) {
    str += ' ';
  }
  return str;
};

var updateDockerContents = function(callback) {
  readYML();
  readDirectory();
  prepDockerFile();
  console.log('Calling Callback');
  callback();
};

var prepDockerFile = function() {
  console.log(dockerFileContents);
  for(var i=0;i<dockerFileContents.length;i++) {
    if(dockerFileContents[i][0] !== '#') {
      dockerFileContents[i][0]= addSpace(dockerFileContents[i][0],Math.max(2,Math.max(0,8 - dockerFileContents[i][0].length)));
    }
    dockerFileContents[i] = dockerFileContents[i].join('');
  }

  return dockerFileContents.join('\n');

};

var writeDockerFile = function(contents) {

  fs.writeFile('./'+SUPERVISOR_DIRNAME+'/DockerFile',contents,function(err,data) {
    if(err) {
      console.log(err);
      if(err.code === 'ENOENT') {
        fs.mkdir('./'+SUPERVISOR_DIRNAME,function(err) {
          if(err) {
            console.log(SUPERVISOR_DIRNAME + 'directory already exists, but I am going to make a new Dockerfile regardless of whether one exists');
          } else {
            console.log(SUPERVISOR_DIRNAME + ' has been created.  Check the directory to see if a Dockerfile exists.  (HINT: It should.)');
          }
          writeDockerFile(contents);
        });
      }
    } else {
      console.log('Dockerfile exists now, but it looks like shit.');
    }
  });
};


updateDockerContents(function() {
  writeDockerFile(dockerFileContents.join('\n'));
});

/*
var addGlobalDependencies = function() {
 fs.readdirSync('./',function(err,files) {

  if(err) {
    console.log(err);
  } else {
    for(var i=0;i<files.length;i++) {
      if(globalDependencies.indexOf(files[i]) > -1) {
        dockerFileContents.push(globalDependencyInstallCommands[files[i]]);
      }
    }
     writeDockerFile(dockerFileContents.join('\n'));
    }
  });
};
*/
