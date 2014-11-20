/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var PageActions = require('../actions/PageActions');
var DefaultLayout = require('../layouts/DefaultLayout');

/**
 * AJAX request to our API to retrieve container information
 * Note: refactor this to the Store later
 */
var config = {
  dockerContainersAPI: 'http://localhost:3123/api/docker/containers/all'
  dockerContainerDetailAPI: 'http://localhost:3123/api/docker/container/'
};

var getContainers = function(context){
  $.ajax({
    url: config.dockerContainersAPI,
    type: 'GET',
    success: function(data){
      console.log(data);
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

var ContainerRow = React.createClass({
  render() {
    return (
      <tr>
        <td> {this.props.name} </td>
        <td> {this.props.links} </td>
        <td> {this.props.status} </td>
        <td> {this.props.ports} </td>
        <td> {this.props.image} </td>
        <td> {this.props.command} </td>
      </tr>
    );
  }
});


var ContainersTable = React.createClass({

  getInitialState() {
    return {
      containers: []
    };
  },

  statics: {
    layout: DefaultLayout
  },

  componentWillMount() {
    PageActions.setTitle('Lifter UI');
  },

  componentDidMount(){
    getContainers(this)
    var self = this;
    setInterval( function(){ getContainers(self) }, 3000);
  },

  componentWillUnmount(){
    clearInterval();
  },

  render() {
    var rows = this.state.containers.map(function(container){
      if ( container.Ports.length ) {
        var ports = container.Ports[0].Type + ' ' + container.Ports[0].PublicPort +
          ' (public) ->' + container.Ports[0].PrivatePort + ' (private)';
      } else {
        var ports = '';
      }
      var nameAndLinks = parseContainerNames(container);
      return (
        <ContainerRow name={nameAndLinks.containerName} links={nameAndLinks.links} status={container.Status} ports = {ports}
          image={container.Image} command={container.Command} />
      )
    });
    return (
      <div className="container">
        <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Links</th>
            <th>Status</th>
            <th>Ports</th>
            <th>Image</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      </div>
    );
  }
});

var DetailedView = React.createClass({
  render() {
    return (
      <div>
        Detailed View
      </div>
    )
  }
});

var Header = React.createClass({
  render() {
    return (
      <div>
        Header - placeholder
      </div>
    )
  }
});


var Display = React.createClass({
  getInitialState() {
    return {
      dashboardView: false
    }
  },

  render() {
    var currentView
    if ( this.state.dashboardView ){
      currentView = <ContainersTable />;
    } else {
      currentView = <DetailedView />;
    }
    return (
      <div>
        <Header />
        <div>
          {currentView}
        </div>
      </div>
    );
  }
});

module.exports = Display;
