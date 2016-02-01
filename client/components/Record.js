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
      var audioFile = this.state.audio.getBlob();
      this.refs.audio.src= data;
      this.refs.audio.play();
      console.log(this.state.audio)
      this.setState({
        audioFile: audioFile
      })
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
    if(!!this.state.videoFile && !!this.state.audioFile){
      helpers.submitVideo(this.state.videoFile).then(function(res){
        //send shortcode to local server and then set state back to null for video
        console.log(res,'response line 58 videoblob')
        helpers.submitRecorded(res, this.state.audioFile).then(function(){
          console.log('successfully sent code')
          console.log(res);
        })
      }.bind(this))
    } else {
      alert('error audio and video file')
    }
  },
  test: function(){
    helpers.test();
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
        <div className="row">
          <div className="col s6">
            <video autoPlay="true" ref='stream'width="400" height="400" muted /> 
          </div>
          <div className="col s6">
            <video autoPlay='true'ref='video2' width="400" height="400" controls />
            <audio ref='audio' autoPlay='true' controls />
            <button onClick={this.record}>Start</button>
            <button onClick={this.stop}>Stop</button>
            <button onClick={this.submit}>Submit</button>
            <button onClick={this.test}>Test</button>
          </div>
        </div>
      </div>
    )
  }
})


module.exports = Record;