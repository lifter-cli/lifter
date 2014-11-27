var React = require('react');

var ContainerRow = React.createClass({

  handleClick: function() {
    this.props.handleClick(this.props.containerId);
  },

  render() {
    return (
      <tr>
        <td><a onClick={this.handleClick}> {this.props.name} </a></td>
        <td> {this.props.links} </td>
        <td> {this.props.status} </td>
        <td> {this.props.ports} </td>
        <td> {this.props.image} </td>
        <td> {this.props.command} </td>
      </tr>
    );
  }
});

module.exports = ContainerRow;
