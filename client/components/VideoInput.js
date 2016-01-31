var React = require('react');
var helpers = require('../config/helper.js');
var Loader = require('react-loader');

var VideoInput = React.createClass({
  getInitialState: function () {
    return { loaded: true };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({
      loaded:false
    });
    if(this.refs.video.files.length > 0){
      var video = this.refs.video.files[0];
      var title = this.refs.title.value;
      var description = this.refs.description.value;
      var validVideoFormats = {
        'video/mp4': true,
        'video/quicktime': true,
        'video/avi': true
      };
      if (validVideoFormats[video.type]){

        helpers.submitVideo(video)
          .then(function(shortcode){

            var data = {
              shortcode: shortcode,
              description: description,
              title: title
            }
            helpers.sendCode(data)
            .then(function(response){
              this.onSuccess();
              this.refs.line.value = '';
              this.refs.video.value = '';
              this.refs.title.value = '';
              this.refs.description.value = '';
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
  onSuccess:function(){
    this.setState({
      loaded: true
    });
  },
  handleFile: function() {
    this.refs.line.value = this.refs.video.files[0].name;
  },
  render: function() {
    return (
          <div className="card-panel">
            <div className="row">
              <Loader loaded={this.state.loaded}>
                <form onSubmit={this.handleSubmit}className="col s12">
                  <h5>Video Submission</h5>
                  <h6>We will send you a text when its done!</h6>
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
                    <input ref="title"type="text" className="validate" placeholder="Video Title"/>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">description</i>
                    <input ref="description"type="text" className="validate" placeholder="Description"/>
                  </div>
                  <div className="text-center"> 
                    <button type="button" type="submit" className="btn btn-info waves-effect waves-light">Submit</button>
                  </div>
                </form>
              </Loader>
            </div>
          </div>
    )
  }
});


module.exports = VideoInput;


