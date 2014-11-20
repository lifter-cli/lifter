var React = require('react');
var DefaultLayout = require('../layouts/DefaultLayout');
var PageActions = require('../actions/PageActions');

var ContainerRow = require('./_ContainerRow');

var apiHelper = require('../modules/apiHelper');
var getContainers = apiHelper.getContainers;
var parseContainerNames = apiHelper.parseContainerNames;

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

module.exports = ContainersTable;
