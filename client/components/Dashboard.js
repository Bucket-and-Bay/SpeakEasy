var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');
var helper = require('../config/helper.js');


var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      video: []
    }
  },

  componentDidMount: function(){
    
    helper.getUserVideos().then(function(response){
      console.log(response, 'dashboard response line 17')
      this.setState({
        video: response.data
      })
    }.bind(this))
  },

  render: function(){
    return (
    <div className="container">
      <VideoInput />
      <div className="row">
      <Video data={this.state.video}/>
      </div>
    </div>
    )
  }
});

module.exports = Dashboard;