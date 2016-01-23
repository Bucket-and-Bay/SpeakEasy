var React = require('react');
var axios = require('axios');

var VideoInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
  },
  handleFile: function() {
  var video = this.refs.video.files[0];    
  var formData = new FormData();
  formData.append('file', video);
  axios.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      //shortcode to send to server
      console.log(response.data.shortcode, 'line 15');
    })
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