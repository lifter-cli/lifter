var fs = require('fs');
var path = require('path');
var yaml = require('../node_modules/js-yaml');
var globalDependencies = require('./globalDependencyList.js');
var helpers = require('./helpers.js');

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

var readYML = function(fileName,dockerFile) {
  var ymlContents = yaml.safeLoad(fs.readFileSync(fileName,{encoding: 'utf-8'}));
  for(var i=0;i<dockerFile.length;i++) {

    if(dockerFile[i][0] === 'FROM') {
      dockerFile[i].push(ymlContents.linuxOS);
    }
    if(dockerFile[i][0] === 'MAINTAINER') {
      dockerFile[i].push(ymlContents.username);
    }
    if(dockerFile[i][0] === 'EXPOSE') {
      dockerFile[i].push(ymlContents.portPublic);
    }
  }
};

var readDirectory = function(dir,dockerFile) {
  var dirContents = fs.readdirSync(dir);

  for(var j=0;j<dockerFile.length;j++) {
    console.log(dockerFile[j].indexOf('EXPOSE'));
    if(dockerFile[j].indexOf('EXPOSE') > -1) {
      var splicePoint = j;
    }
  }

  for(var i=0;i<dirContents.length;i++) {
    if(globalDependencies.files.indexOf(dirContents[i]) > -1) {
      console.log('splicePoint: ',splicePoint);
      if(splicePoint) {
      dockerFile.splice(splicePoint,0,globalDependencies.installCommands[dirContents[i]]);
      } else {
      dockerFile.push(globalDependencies.installCommands[dirContents[i]]);
      }
    }
  }
};

var updateDockerContents = function(callback) {
  readYML('lifter.yml',dockerFileContents);
  readDirectory('./',dockerFileContents);
  prepDockerFile(dockerFileContents);
  console.log('Calling Callback');
  callback();
};

var prepDockerFile = function(dockerFile) {
  for(var i=0;i<dockerFile.length;i++) {
    if(dockerFile[i][0] !== '#') {
      dockerFile[i][0]= helpers.addSpace(dockerFile[i][0],Math.max(2,Math.max(0,8 - dockerFile[i][0].length)));
    }
    dockerFile[i] = dockerFile[i].join('');
  }
  return dockerFile.join('\n');
};

var writeDockerFile = function(contents) {
  fs.writeFile('.'+'/DockerFile',contents,function(err,data) {
    if(err) {
      console.log(err);
      }
//     writeDockerFile(contents);
    console.log('Dockerfile exists now, but it looks like shit.');
  });
};

updateDockerContents(function() {
  writeDockerFile(dockerFileContents.join('\n'));
});

