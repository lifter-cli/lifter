var fs = require('fs');
var path = require('path');
var yaml = require('../../node_modules/js-yaml');
var dependencies = require('./globalDependencyList.js');
var helpers = require('./helpers.js');

/**
* Array that constructs basic template to build Dockerfile
* Each subarray of dockerfileContents will render as its own line in Dockerfile - THIS SEEMS HACKY
* @array
*/
var dockerfileContents = [
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
* @param {array} dockerfile Array of sub-arrays that will render as a Dockerfile
*/
var addToDockerfile = function(dockerfile) {
  var settings = helpers.readYAML();
  for(var i=0;i<dockerfile.length;i++) {

    if(dockerfile[i][0] === 'FROM') {
      dockerfile[i].push(settings.linuxOS);
    }
    if(dockerfile[i][0] === 'MAINTAINER') {
      dockerfile[i].push(settings.username);
    }
    if(dockerfile[i][0] === 'EXPOSE') {
      dockerfile[i].push(settings.portPublic);
    }
  }
};

/**
* Function that searches root directory for files that require global dependencies
* @function
* @memberof module:validation
* @param {string} dir Filepath of directory to check
* @param {array} dockerfile Array of sub-arrays that will render as a Dockerfile
*/
var readDirectory = function(dir,dockerfile) {
  var files = fs.readdirSync(dir);

  for(var j=0;j<dockerfile.length;j++) {
    if(dockerfile[j].indexOf('EXPOSE') > -1) {
      var splicePoint = j;
    }
  }

  for(var i=0;i<files.length;i++) {
    var file = files[i];
    if(dependencies.files.indexOf(file) > -1) {
      var installCommand = dependencies.installCommands[file];
      if(splicePoint) {
        dockerfile.splice(splicePoint,0,installCommand);
      } else {
        dockerfile.push(installCommand);
      }
    }
  }
};


/**
* Function that searches root directory for files that require global dependencies
* @function
* @param {function} callback Callback function that is invoked once Dockerfile is ready
*/
var buildDockerfile = function() {
  console.log('addtoDockerfile', dockerfileContents);
  addToDockerfile(dockerfileContents);
  console.log('readDirectory', dockerfileContents);
  readDirectory('./',dockerfileContents);
  console.log('prepDockerfile', dockerfileContents);
  prepDockerfile(dockerfileContents);
  fs.writeFileSync('./Dockerfile',dockerfileContents.join('\n'));
  console.log('Dockerfile exists now.  High five!');
};

/**
* Function that formats each line of Dockerfile
* @function
* @memberof module:validation
* @param {array} dockerfile Array of sub-arrays that will render as a Dockerfile
*/
var prepDockerfile = function(dockerfile) {
  for(var i=0;i<dockerfile.length;i++) {
    if (Array.isArray(dockerfile[i])) {
      var lineStart = dockerfile[i][0];
      if(lineStart !== '#') {
        var cmdLength = lineStart.length;
        dockerfile[i][0] = lineStart + spaces(cmdLength);
      }
      dockerfile[i] = dockerfile[i].join('');
    }
  }
  return dockerfile.join('\n');
};

/**
* Function returns number of spaces required after command in Dockerfile
* @function
* @memberof module:validation
* @param {number} num Length of command converted to num of spaces
*/
var spaces = function(num) {
  num = 8 - num;
  num = num < 2 ? 2 : num;
  return Array(num).join(" ");
}

module.exports = {
  buildDockerfile : buildDockerfile
}
