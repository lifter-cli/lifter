var React = require('react');

var DetailedView = React.createClass({
  getInitialState() {
    return {
      containerId: 'placeholder'
    };
  },

  render() {
    return (
      <div>
        Detailed View
      </div>
    )
  }
});

module.exports = DetailedView;
