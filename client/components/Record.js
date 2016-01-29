var React = require('react');
var helpers = require('../config/helper.js');
var RecordRTC = require('recordrtc');
var helpers = require('../config/helper.js');

function videoError(){
  console.log('error')
};
var Record = React.createClass({
  getInitialState: function(){
    return {
      stream: {},
      recorder: {},
      audio: {},
      videoFile: null,
      audioFile: null,
    }
  },
  record: function(){
    var videoOptions = {
      mimeType: 'video/mp4', // or video/mp4 or audio/ogg
      bitsPerSecond: 128000
    };
    var audioOptions = {
      mimeType: 'audio/ogg',
      bitsPerSecond: 128000
    }
    var videoRTC = RecordRTC(this.state.stream, videoOptions);
    var audioRTC = RecordRTC(this.state.stream, audioOptions);
    videoRTC.startRecording();
    audioRTC.startRecording();
    this.setState({
      recorder: videoRTC,
      audio: audioRTC
    })
  },
  stop: function(){
    this.state.audio.stopRecording(function(data){
      this.refs.audio.src= data;
      this.refs.audio.play();
    }.bind(this));

    this.state.recorder.stopRecording(function(data){
      this.refs.video2.src = data;
      this.refs.video2.load();
      var videoFile = this.state.recorder.getBlob();
      this.setState({
        videoFile: videoFile
      })
   
     
    }.bind(this));

  },
  submit: function(){
    if(!!this.state.videoFile){
      helpers.submitVideo(this.state.videoFile).then(function(res){
        //send shortcode to local server and then set state back to null for video
        console.log(res,'response line 58 videoblob')
      }.bind(this))
    } else {
      alert('no file')
    }
  },
  componentDidMount: function(){
    var video = this.refs.stream;
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
    var video = this.refs.stream;
    video.src = '';
    this.state.stream.getAudioTracks()[0].stop()
    this.state.stream.getVideoTracks()[0].stop()
  },
  render:function(){
    return(
      <div className="container">
        <video autoPlay="true" ref='stream'width="700" height="400" muted />
        <video autoPlay='true'ref='video2' width="400" height="400" controls />
        <audio ref='audio' autoPlay='true' controls />
        <button onClick={this.record}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.submit}>Submit Video for Analysis</button>
      </div>
    )
  }
})


module.exports = Record;