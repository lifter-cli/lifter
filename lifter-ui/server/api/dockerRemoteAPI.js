var Docker = require('dockerode');
// var docker = new Docker({socketPath: '/var/run/docker.sock'});
// // var docker2 = new Docker({host: 'http://192.168.1.10', port: 3000});
// // var docker3 = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
// // var docker4 = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http
// //

var caPath = process.env.DOCKER_MONITOR_CA_PATH || (process.env.DOCKER_CERT_PATH + '/ca.pem');
var certPath = process.env.DOCKER_MONITOR_CERT_PATH || (process.env.DOCKER_CERT_PATH + '/cert.pem');
var keyPath = process.env.DOCKER_MONITOR_KEY_PATH || (process.env.DOCKER_CERT_PATH + '/key.pem');
var host = process.env.DOCKER_MONITOR_HOST_IP || '192.168.59.103';

var fs = require('fs');
var dockerSettings = {};
if ( process.env.AZURE_UBUNTU ) {
  dockerSettings = {
    socketPath: '/var/run/docker.sock'
  };
} else {
  dockerSettings = {
    protocol: 'https',
    host: host,
    port: process.env.DOCKER_PORT || 2376,
    ca: fs.readFileSync(caPath),
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  };
}
var docker = new Docker(dockerSettings);

exports.docker = docker;
