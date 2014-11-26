var Docker = require('dockerode');
// var docker = new Docker({socketPath: '/var/run/docker.sock'});
// // var docker2 = new Docker({host: 'http://192.168.1.10', port: 3000});
// // var docker3 = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
// // var docker4 = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http
// //

var caPath = process.env.DOCKER_CA_PATH || (process.env.DOCKER_CERT_PATH + '/ca.pem');
var certPath = process.env.DOCKER_CERT_PATH || (process.process.env.DOCKER_CERT_PATH + '/cert.pem');
var keyPath = process.env.DOCKER_KEY_PATH || (process.env.DOCKER_CERT_PATH + '/key.pem');

var fs = require('fs');
var docker = new Docker({
  protocol: 'https',
  host: '192.168.59.103',
  port: process.env.DOCKER_PORT || 2376,
  ca: fs.readFileSync(caPath),
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath)
});

exports.docker = docker;
