var express = require('express');
var router = express.Router();
var docker = require('../api/dockerRemoteAPI').docker;

/* GET docker remote API info */
router.get('/docker', function(req, res) {
  console.log('in the server, docker api');
  res.send('docker remote api reached');
});
router.get('/docker/containers', function(req, res) {
  docker.listContainers(function(err, containers){
    if (err){
      console.log(err);
      return;
    }
    res.send(containers);
  });
});

module.exports = router;
