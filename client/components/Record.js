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
      audio64: null,
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
      var reader = new window.FileReader();
      reader.readAsDataURL(audioFile);
      reader.onloadend = function() {
        var base64data = reader.result;                
        this.setState({
          audioFile: audioFile,
          audio64: base64data
        })
      }.bind(this); 
     
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
        helpers.submitRecorded(res, this.state.audioFile, this.state.audio64).then(function(){
          console.log('successfully sent code')
          this.setState({
            videoFile: null,
            audioFile: null,
            audio64: null,
          })
          console.log(res);
        }.bind(this))
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