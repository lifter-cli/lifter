var React = require('react');
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

  componentWillMount() {
  },

  componentDidMount(){
    getContainers(this)
    var self = this;
    this.getContainerInterval = setInterval( function(){ getContainers(self) }, 3000);
  },

  componentWillUnmount(){
    clearInterval();
  },

  handleClick( containerId ){
    this.props.handleClick( containerId );
    clearInterval(this.getContainerInterval);
  },

  render() {
    var handleClick = this.handleClick;
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
          image={container.Image} command={container.Command} handleClick={handleClick} containerId={container.Id}/>
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
