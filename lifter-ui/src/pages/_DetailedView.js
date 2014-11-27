var React = require('react');
var _ = lodash = require('../../../node_modules/lodash/lodash');
var apiHelper = require('../modules/apiHelper');
var getContainerDetail = apiHelper.getContainerDetail;

var ContainerComponent = React.createClass({
  render() {
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.propertyType}</h3>
        </div>
        <div className="panel-body">
          {this.props.value}
        </div>
      </div>
    )
  }
});

var DetailedView = React.createClass({
  getInitialState() {
    return {
      containerDetail: {}
    };
  },

  componentDidMount() {
    getContainerDetail(this, this.props.containerId);
  },

  render() {
    var properties = _.map(this.state.containerDetail, function(value, key){
      return (
        <ContainerComponent propertyType={key} value={value} />
      )
    });
    return (
      <div>
        <a onClick={this.props.handleMainClick}>Detailed View</a>
        <div>
        </div>
        <div>
          {properties}
        </div>
      </div>
    )
  }
});

module.exports = DetailedView;
