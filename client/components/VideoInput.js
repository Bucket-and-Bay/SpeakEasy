var React = require('react');

var VideoInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
  },
  handleFile: function() {
    console.log(this.refs.video.files[0]);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
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