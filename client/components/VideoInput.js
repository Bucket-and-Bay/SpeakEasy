var React = require('react');
var helpers = require('../config/helper.js');

var VideoInput = React.createClass({
  handleSubmit: function(e) {
    console.log('submit');
    e.preventDefault();
  },
  handleFile: function() {
    var video = this.refs.video.files[0];
    var validVideoFormats = {
      'video/mp4': true,
      'video/quicktime': true,
      'video/avi': true
    };
    if (validVideoFormats[video.type]){
      helpers.submitVideo(video)
        .then(function(data){
          helpers.sendCode(data)
          .then(function(response){
            //successful post to local server
            console.log('submitted video for analysis');
          });
        })   
    } else {
      alert("This is an invalid video format. Please upload .mp4, .mov, or .avi only.");
    }
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="file-field input-field">  
          <div className="btn">
            <span>File</span>
            <input type="file" ref='video' onChange={this.handleFile} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </form>
    )
  }
});


module.exports = VideoInput;