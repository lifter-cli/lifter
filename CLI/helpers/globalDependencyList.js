/**
* @module globalDependencies
*/

/**
* Array comprised of files that may require global dependency installation
* @array
*/
var files = ['bower.json','karma.conf', 'gruntfile.js', 'gulpfile.js'];

/**
* Object that matches Dockerfile commands with files that may require global dependency installations
* @object
*/
var installCommands = {
  'bower.json': ['RUN','npm install -g bower'],
  'karma.conf': ['RUN','npm install -g karma'],
  'gruntfile.js': ['RUN','npm install -g grunt-cli'],
  'gulpfile.js': ['RUN','npm install -g gulp']
};

module.exports = {
  files: files,
  installCommands: installCommands
}
