/**
* @module globalDependencies
*/

/**
* Array comprised of files that may require global dependency installation
* @array
*/
var files = ['bower.json','karma.conf','README.md'];

/**
* Object that matches Dockerfile commands with files that may require global dependency installations
* @object
*/
var installCommands = {
'bower.json': ['RUN','yum install bower -g'],
'README.md': ['RUN','yum install -y yml'],
'karma.conf': ['RUN','yum install karma -g']
};

module.exports = {
  files: files,
  installCommands: installCommands
}