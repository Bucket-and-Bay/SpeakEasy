var React = require('react');
var Navbar = require('./Navbar.js');
var VideoPlayer = require('./VideoPlayer.js');
var helpers = require('../config/helper.js');

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
    helpers.getVideoComments(this.props.params.videoID)
      .then(function(response){
        this.setState({
          videoSource: response.data[0].videoUrl,
          videoTitle: response.data[0].title,
          videoDate: response.data[0].date,
          username: response.data[0].username
        })
      }.bind(this))
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col s8">
              <VideoPlayer data={this.state.videoSource} />
            </div>
          <div className="col s4">
            <div className="video-info">
              <h4>{this.state.videoTitle}</h4>
              <p>User: {this.state.username}</p>
              <p>{this.state.videoDate}</p>
            </div>
          </div>
        </div>
        <div className="col 12">
          <h5>Comments</h5>
          <p>List of Comments</p>
          <p>Add Comments</p>
          <div className="row">
            <form className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <i className="material-icons prefix">mode_edit</i>
                  <textarea id="icon_prefix2" className="materialize-textarea" placeholder="Leave comment..."></textarea>
                  <label htmlFor="icon_prefix2"></label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    )
  }
});

module.exports = PublicVideoComments;