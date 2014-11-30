/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var ContainersTable = require('./_ContainersTable');
var DetailedView = require('./_DetailedView');

/**
* Header section of Lifter Monitor user interface
* @class Header
*/
var Header = React.createClass({
  render() {
    return (
      <div>
        <div className="page-header">
          <h1>Lifter UI <small> Monitor your containers</small></h1>
        </div>
      </div>
    )
  }
});

/**
* Main section of the Lifter Monitor user interface that switches
* between dashboard view and detaield view
* @name Display
*/
var Display = React.createClass({
  handleContainerClick(containerId) {
    console.log('handling container click');
    this.setState({
      containerId: containerId,
      containerView: true
    });
  },

  handleMainClick(){
    this.setState({
      containerView: false
    });
  },

  getInitialState() {
    return {
      containerView: false
    }
  },

  render() {
    var currentView
    if ( !this.state.containerView ){
      currentView = <ContainersTable handleClick={this.handleContainerClick} />;
    } else {
      currentView = <DetailedView containerId={this.state.containerId} handleMainClick={this.handleMainClick}/>;
    }
    return (
      <div className="container">
        <div className="row center">
          <div className="col-xs-12 col-sm-8 col-md-10">
            <Header />
          </div>
          <div className="col-xs-12 col-sm-8 col-md-10">
            {currentView}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Display;
