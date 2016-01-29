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
          <div className="card-panel">
            <div className="row">
              <form onSubmit={this.handleSubmit}className="col s12">
                <h5>Video Submission</h5>
                <h6>We will send you a text when it's done!</h6>
                <br/>
                <div className="file-field input-field">  
                  <div className="btn">
                  <span>File</span>
                    <input type="file" ref='video' onChange={this.handleFile} />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" ref="line"type="text" />
                  </div>
                </div>
                <div className="input-field">
                  <i className="material-icons prefix">view_headline</i>
                  <input id="icon_prefix" type="text" class="validate" placeholder="Video Title"/>
                </div>
                <div className="input-field">
                  <i className="material-icons prefix">description</i>
                  <input id="icon_telephone" type="tel" class="validate" placeholder="Description"/>
                </div>
              </form>
              <div className="text-center">
                <button type="button" className="btn btn-info waves-effect waves-light">Submit</button>
              </div>
            </div>
          </div>
    )
  }
});


module.exports = VideoInput;


