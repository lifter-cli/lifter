var Docker = require('dockerode');
// var docker = new Docker({socketPath: '/var/run/docker.sock'});
// // var docker2 = new Docker({host: 'http://192.168.1.10', port: 3000});
// // var docker3 = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
// // var docker4 = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http
// //

var fs = require('fs');
var docker = new Docker({
  protocol: 'https',
  host: '192.168.59.103',
  port: process.env.DOCKER_PORT || 2376,
  ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
  cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
  key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
});
//...
//
// create a container entity. does not query API
console.log( docker );
var container = docker.getContainer('cbc7aa568216');

// query API for container info
container.inspect(function (err, data) {
  console.log('Container Inspector');
  console.log(data);
});
