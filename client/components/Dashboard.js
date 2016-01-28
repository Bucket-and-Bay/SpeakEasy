var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');
var helper = require('../config/helper.js');

//image property
//video url property
//analysis of the video
//title
//associated user

var Dashboard = React.createClass({
  getInitialState: function() {

    return {
      video: []
    }
  },

  componentDidMount: function(){
    //get users info here
    helper.getUserVideos().then(function(response){
      this.setState({
        video: response.data
      })
    }.bind(this))
  },

  render: function(){
    return (
    <div className="row">
      <VideoInput />
       <Video data={this.state.video}/>
    </div>
    )
  }
});

module.exports = Dashboard;