var React = require('react');
var VideoPlayer = require('./VideoPlayer.js');
var helpers = require('../config/helper.js');
var moment = require('moment');
var Infinite = require('react-infinite');
var CommentBoxB = require('./CommentBox.js');


var PublicVideoComments = React.createClass({
  getInitialState: function(){
    return {
      videoSource: '',
      videoTitle: '',
      videoDate: '',
      videoId: this.props.params.videoID,
      username: '',
      comments: [],
      author: ''
    }
  },

  componentDidMount: function() {
    window.analytics.page('Video Comments', {videoId: this.props.params.videoID});
  },

  componentWillMount: function() {
    helpers.getVideoComments(this.props.params.videoID)
      .then(function(response){
        this.setState({
          videoSource: response.data[0].videoUrl,
          videoTitle: response.data[0].title,
          videoDate: response.data[0].date.slice(0,10),
          username: response.data[0].username,
          comments: response.data[0].comments
        })
      }.bind(this))
  },

  render: function() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col s8">
              <VideoPlayer data={this.state.videoSource} />
            </div>
          <div className="col s4">
            <div className="video-info">
              <h4>{this.state.videoTitle}</h4>
              <p>User: {this.state.username}</p>
              <p>Created: {this.state.videoDate}</p>
            </div>
          </div>
        </div>
        <div className="col 12">
          <CommentBoxB data={this.state.comments} author={this.state.author} videoId={this.state.videoId} />
        </div>
      </div>
      </div>
    )
  }
});

module.exports = PublicVideoComments;