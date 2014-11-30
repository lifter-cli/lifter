/**
 * AJAX request to our API to retrieve container information
 * Note: refactor this to the Store later
 */

var config = {
  dockerContainersAPI: '/api/docker/containers/all',
  dockerContainerDetailAPI: '/api/docker/container/'
};

/**
* Function to do an AJAX GET request on the express REST-ful API to access
* detailed Docker information for a specific container
* @function
* @param {object} context Reference to the React component that will store the container detail information
* @param {string} id Docker container's unique hash ID
*/
var getContainerDetail = function(context, id){
  $.ajax({
    url: config.dockerContainerDetailAPI + id,
    type: 'GET',
    success: function(data){
      context.setState({
        containerDetail: data
      });
    },
    error: function(err){
      console.log('error received', err);
    }
  });
};

var getContainers = function(context){
  $.ajax({
    url: config.dockerContainersAPI,
    type: 'GET',
    success: function(data){
      context.setState({
        containers: data
      });
    },
    error: function(err){
      console.log('error received', err);
    }
  });
};

var parseContainerNames = function(container){
  var parsedNames = {};
  container.Names.forEach(function(name){

    // Handle names that are links
    // If there are two '/', then it's a link
    var nameRegex = /\/.*\//;
    if ( nameRegex.test(name) ) {
      var relationship = name.split('/');
      var linkedContainerName = relationship[1];
      var alias = relationship[2];
      parsedNames.links = parsedNames.links || [];
      parsedNames.links.push(
        'Alias: ' + alias + ' Linked container: ' + linkedContainerName + ' '
      );
    } else {
    // Else handle the actual container name
      parsedNames.containerName = name;
    }
  });
  return parsedNames;
};

module.exports = {
  getContainerDetail: getContainerDetail,
  getContainers: getContainers,
  parseContainerNames: parseContainerNames
};
