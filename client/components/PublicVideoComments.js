var React = require('react');
var Navbar = require('./Navbar.js');
var VideoPlayer = require('./VideoPlayer.js');

var PublicVideoComments = React.createClass({
  getInitialState: function(){
    return {
      videoSource: '',
      videoTitle: '',
      videoDate: '',
      videoId: this.props.params.videoID,
      username: ''
    }
  },

  componentDidMount: function() {
    console.log('call getVideoComments');
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <p>VIDEO HERE</p>
      </div>
    )
  }
});

module.exports = PublicVideoComments;