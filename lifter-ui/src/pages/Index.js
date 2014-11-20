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
var ContainersTable = require('./_ContainersTable');
var DetailedView = require('./_DetailedView');

var Header = React.createClass({
  render() {
    return (
      <div>
        <div className="page-header">
          <h1>Lifter UI<small>Monitor your containers</small></h1>
        </div>
        <ul className="nav nav-tabs">
          <li role="presentation" className="active"><a href="#">Dashboard</a></li>
          <li role="presentation"><a href="#">Detailed View</a></li>
        </ul>
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
