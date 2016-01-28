var React = require('react');

var VideoPlayer = React.createClass({
  propTypes: {
    data: React.PropTypes.string.isRequired
  },
  componentDidUpdate(){
    this.refs.video.load();
  }, 
  render: function(){
    return (
      <div className="video-frame">
        <video ref="video" width="700" height="400" controls>
        <source src={this.props.data} type="video/mp4"/>
        Your browser does not support the eo tag.
        </video>
      </div>
    )
  }
})

module.exports = VideoPlayer;