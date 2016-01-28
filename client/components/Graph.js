var React = require('react');
var Highcharts = require('highcharts');
global.Highcharts = require("highcharts");
var ReactHighcharts = require('react-highcharts');
var axios = require('axios');

var Graph = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  
  render: function(){ 
    return(
      <ReactHighcharts config={this.props.data}>Graph</ReactHighcharts>
    )
  }
});


module.exports = Graph;
