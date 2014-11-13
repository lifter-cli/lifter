/*
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
*/
var assert = require('assert')
var fs = require('fs');
var validation = require('../CLI/validation/validation.js');
var yaml = require('../node_modules/js-yaml');

var lifterFilePath = './lifter.yml';
var dockerFilePath = './Dockerfile';

var lifterFileContents = yaml.safeLoad(fs.readFileSync(lifterFilePath,{encoding: 'utf-8'}));
// var dockerFileContents = fs.readFileSync(dockerFilePath,{encoding: 'utf-8'});

var prepYML = function(obj) {
  for(var key in obj) {
    if(key === 'portPrivate' || key === 'portPublic') {
      obj[key] = parseInt(obj[key]);
    }
  }
  return obj;
};

var prepDockerfile = function(obj) {
  for(var key in obj) {
    if(key === 'portPrivate' || key === 'portPublic') {
      obj[key] = parseInt(obj[key]);
    }
  }
  return obj;
};

console.log(lifterFileContents);
console.log(prepYML(lifterFileContents).portPublic);

// console.log(dockerFileContents);

describe('lifter.yml', function() {
  describe('selection options', function(){
    it('should be one of the available choices', function(){
      assert.equal(true,validation.inOptions({value: 'Angular', options: ['Angular','Backbone']}));
      assert.equal(false,validation.inOptions({value: 'Ang', options: ['Angular','Backbone']}));
      assert.equal(false,validation.inOptions({value: '', options: ['Angular','Backbone']}));
      assert.equal(false,validation.inOptions({value: 1, options: ['Angular','Backbone']}));
    });

    it('should not be empty', function(){
      assert.equal(true,validation.hasValue({value: 'adguou'}));
      assert.equal(false,validation.hasValue({value: true}));
      assert.equal(false,validation.hasValue({value: ''}));
      assert.equal(false,validation.hasValue({value: 3}));
      assert.equal(true,validation.hasValue({value: '3'}));
    });

  });

  describe('scaffolding options', function(){
    it('should only be in file when scaffolding has been selected', function(){
      assert.equal(prepYML(lifterFileContents).scaffolding !=='Yes' && prepYML(lifterFileContents).mvc === undefined,true);
      assert.equal(prepYML(lifterFileContents).scaffolding !=='Yes' && prepYML(lifterFileContents).appServer === undefined,true);
      assert.equal(prepYML(lifterFileContents).scaffolding !=='Yes' && prepYML(lifterFileContents).envVar === undefined,true);
      assert.equal(prepYML(lifterFileContents).scaffolding ==='Yes' && prepYML(lifterFileContents).scaffolding !== undefined,true);
    });


    it('that are public should be exposed in Dockerfile', function(){
      assert.equal(prepYML(lifterFileContents).portPublic,prepDockerfile(dockerFileContents).expose);
    });
  });


  describe('ports', function(){
    it('should be numbers within the possible port range', function(){
      assert.equal(true,validation.inPortRange({value: 2009}));
      assert.equal(false,validation.inPortRange({value: 9}));
      assert.equal(false,validation.inPortRange({value: '9'}));
      assert.equal(false,validation.inPortRange({value: NaN}));
    });


    it('that are public should be exposed in Dockerfile', function(){
      assert.equal(prepYML(lifterFileContents).portPublic,prepDockerfile(dockerFileContents).expose);
    });
  });



});

// More tests
// Make sure that lifter.yml and Dockerfile are in sync

// Make sure that when scaffolding = no, there are no MVC or back end entries in YML file


/*

fs.readFile(lifterFilePath,{encoding: 'utf-8'},function(err,fd){
  if(err) {console.log(err);}
//   console.log(fd);
//   console.log(typeof fd);
  var lifterArr = fd.split('\n');
//   console.log(lifterArr);

  var portObj = {};
  for(var i=0;i<lifterArr.length;i++) {
    var subArr = lifterArr[i].split(':');
//     console.log(subArr);

    if(subArr[0] === 'portPrivate') {
      portObj.value = parseInt(subArr[1]);
    }

  }


    console.log(assert.equal(validation.inPortRange(portObj),true));
    assert.equal(validation.inPortRange(portObj),true);

});
*/




/*

describe('Dockerfile', function() {
  describe('The Dockerfile should reflect lifter.yml data', function(){
    it('should expose the public port number found in the YML file', function(){



      validation.inOptions({value: 'Angular', options: ['Angular','Backbone']}).should.equal(true);
    });
  });
});
*/

