var React = require('react');
var helpers = require('../config/helper.js');

var VideoInput = React.createClass({
  handleSubmit: function(e) {

    e.preventDefault();

    if(this.refs.video.files.length > 0){
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
              this.refs.line.value = '';
              this.refs.video.value = '';
              console.log('submitted video for analysis');
            }.bind(this));
          }.bind(this))   
      } else {
        alert("This is an invalid video format. Please upload .mp4, .mov, or .avi only.");
      }
    } else {
      console.log('choose a file');
    }
  },
  handleFile: function() {
    this.refs.line.value = this.refs.video.files[0].name;
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
            <input className="file-path validate" ref="line"type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
      </form>
    )
  }
});


module.exports = VideoInput;