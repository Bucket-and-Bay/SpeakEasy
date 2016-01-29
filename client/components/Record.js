var React = require('react');
var helpers = require('../config/helper.js');

function videoError(){
  console.log('error')
};
var Record = React.createClass({
  getInitialState: function(){
    return {
      stream: {}
    }
  },
  componentDidMount: function(){
    var video = this.refs.video;
    var that = this;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if(navigator.getUserMedia){
      navigator.getUserMedia({video: true, audio: true}, function(stream){
        video.src = window.URL.createObjectURL(stream);
        that.setState({
          stream: stream
        })
      }, videoError)
    }
  },
  componentWillUnmount: function(){
    var video = this.refs.video;
    video.src = '';
    this.state.stream.getAudioTracks()[0].stop()
    this.state.stream.getVideoTracks()[0].stop()
  },
  render:function(){
    return(
      <div className="container">
        <video autoPlay="true" ref='video'width="700" height="400" muted>
      
        </video>
      </div>
    )
  }
})


module.exports = Record;