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
