
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
