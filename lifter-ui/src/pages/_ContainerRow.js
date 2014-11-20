var React = require('react');

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

module.exports = ContainerRow;
