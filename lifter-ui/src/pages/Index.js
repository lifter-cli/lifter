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
  dockerAPI: 'http://localhost:3123/api/docker/containers'
};

var getContainers = function(context){
  var self = context;
  $.ajax({
    url: config.dockerAPI,
    type: 'GET',
    success: function(data){
      console.log(data);
      self.setState({
        containers: data
      });
    }
  });
};



var ContainerRow = React.createClass({
  // componentDidMount: function(){
  //   this.setState({
  //     name: container.names,
  //     status: container.status,
  //     ports: container.ports,
  //     image: container.image,
  //     command: container.command
  //   });
  // },

  render() {
    return (
      <tr>
        <td> {this.props.names} </td>
        <td> {this.props.status} </td>
        <td> {this.props.ports} </td>
        <td> {this.props.image} </td>
        <td> {this.props.command} </td>
      </tr>
    );
  }
});

var ContainersTable = React.createClass({

  getInitialState: function(){
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
    getContainers(this);
  },

  render() {
    var rows = this.state.containers.map(function(value){
      return (
        <ContainerRow names='helloname' status={value.status} ports ={value.ports} image={value.image} command={value.command} />
      )
    });
    return (
      <div className="container">
        <table className="table">
        // <caption>{this.state.containers}</caption>
        <thead>
          <tr>
            <th>Name</th>
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

module.exports = ContainersTable;
