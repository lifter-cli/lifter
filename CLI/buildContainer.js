var fs = require('fs');
var path = require('path');
var yaml = require('../node_modules/js-yaml');
var globalDependencies = require('./globalDependencyList.js');
var helpers = require('./helpers.js');

/**
* Array that constructs basic template to build Dockerfile
* Each subarray of dockerFileContents will render as its own line in Dockerfile - THIS SEEMS HACKY
* @array
*/
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

/**
* Function that authenticates input username and password against Dockerhub API
* @function
* @memberof module:validation
* @param {string} filename Filename of YML file that will be loaded and parsed
* @param {array} dockerFile Array of sub-arrays that will render as a Dockerfile
*/
var readYML = function(filename,dockerFile) {
  var ymlContents = yaml.safeLoad(fs.readFileSync(filename,{encoding: 'utf-8'}));
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

/**
* Function that searches root directory for files that require global dependencies
* @function
* @memberof module:validation
* @param {string} dir Filepath of directory to check
* @param {array} dockerFile Array of sub-arrays that will render as a Dockerfile
*/
var readDirectory = function(dir,dockerFile) {
  var files = fs.readdirSync(dir);

  for(var j=0;j<dockerFile.length;j++) {
    // console.log(dockerFile[j].indexOf('EXPOSE'));
    if(dockerFile[j].indexOf('EXPOSE') > -1) {
      var splicePoint = j;
    }
  }

  for(var i=0;i<files.length;i++) {
    if(globalDependencies.files.indexOf(files[i]) > -1) {
      var installCommand = globalDependencies.installCommands[files[i]];
      if(splicePoint) {
        dockerFile.splice(splicePoint,0,installCommand);
      } else {
        dockerFile.push(installCommand);
      }
    }
  }
};


/**
* Function that searches root directory for files that require global dependencies
* @function
* @param {function} callback Callback function that is invoked once Dockerfile is ready
*/
var updateDockerContents = function() {
  readYML('lifter.yml',dockerFileContents);
  readDirectory('./',dockerFileContents);
  prepDockerFile(dockerFileContents);
  fs.writeFileSync('.'+'/Dockerfile',dockerFileContents.join('\n'));
  console.log('Dockerfile exists now.  High five!');
};

/**
* Function that formats each line of Dockerfile
* @function
* @memberof module:validation
* @param {array} dockerFile Array of sub-arrays that will render as a Dockerfile
*/
var prepDockerFile = function(dockerFile) {
  for(var i=0;i<dockerFile.length;i++) {
    if(dockerFile[i][0] !== '#') {
      dockerFile[i][0]= helpers.addSpace(dockerFile[i][0],Math.max(2,Math.max(0,8 - dockerFile[i][0].length)));
    }
    dockerFile[i] = dockerFile[i].join('');
  }
  return dockerFile.join('\n');
};

module.exports = {
  buildDockerFile : updateDockerContents
}

