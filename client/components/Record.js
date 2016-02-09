var React = require('react');
var helpers = require('../config/helper.js');
var RecordRTC = require('recordrtc');
var helpers = require('../config/helper.js');
var Loader = require('react-loader');

function videoError(){
  console.log('error')
};

var Record = React.createClass({
  getInitialState: function(){
    return {
      timer: undefined,
      isStart: false,
      diff: 0,
      elapsed: 0, 
      loaded: true,
      stream: {},
      recorder: {},
      audio: {},
      videoFile: null,
      audioFile: null,
    }
  },

  record: function(){
    if(!this.state.isStart){
      var timer = setInterval(this.tick, 33);
      this.setState({
        isStart: true,
        timer: timer,
        start: new Date()
      })
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
    }

  },
  tick: function(){
    var elapsed = Date.now() - this.state.start + this.state.diff
    this.setState({
      elapsed: elapsed
    })
  },
  stop: function(){

    if(this.state.isStart){
      console.log('clear')
      clearInterval(this.state.timer);
        this.setState({
        timer: undefined,
        isStart: false,
        diff: 0,
      });  
      this.state.audio.stopRecording(function(data){
        var audioFile = this.state.audio.getBlob();
        this.refs.audio.src= data;
        this.refs.audio.play();             
        this.setState({
          audioFile: audioFile,
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
    }

  },
  getTimeSpan: function(elapsed) { // 754567(ms) -> "12:34.567"
    var m = String(Math.floor(elapsed/1000/60)+100).substring(1);
    var s = String(Math.floor((elapsed%(1000*60))/1000)+100).substring(1);
    var ms = String(elapsed % 1000 + 1000).substring(1);
    return m+":"+s+"."+ms;
  },
  submit: function(e){
    e.preventDefault();
    if(this.checkForm()){
      var title = this.refs.title;
      var description = this.refs.description;
      this.setState({
        loaded: false
      });
    
        //send shortcode to local server and then set state back to null for video
      var data = {
        audioFile: this.state.audioFile,
        videoFile: this.state.videoFile,
        title: title.value,
        description: description.value
      }
      helpers.submitRecorded(data).then(function(){
        title.value = '';
        description.value = '';
        this.setState({
          videoFile: null,
          audioFile: null,
          loaded: true
        });
      }.bind(this))
   
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
    clearInterval(this.state.timer);
    this.setState({
      timer: undefined
    });
    var video = this.refs.stream;
    video.src = '';
    this.state.stream.getAudioTracks()[0].stop()
    this.state.stream.getVideoTracks()[0].stop()
  },
  checkForm: function(){
    if(!!this.state.videoFile && !!this.state.audioFile && this.refs.title.value.length > 0 && this.refs.description.value.length > 0 ){
      return true;
    } else {
      alert('Title and Description is required')
      return false;
    }
  },
  render:function(){
    return(
      <div>
        <div className="container">
          <div className="row">
            <div id="videorecorder" className="center-align">
              <video autoPlay="true" ref='stream'width="400" height="300" muted /> 
            </div>
          </div>
          <div className="row center-align">
            <div>Timer: {this.getTimeSpan(this.state.elapsed)}</div>
            <button onClick={this.record} className="btn btn-info waves-effect waves-light ">Start</button>
            <button onClick={this.stop} className="btn btn-info waves-effect waves-light">Stop</button>
          </div>
          <div className="card-panel">
            <div className="row">
              <Loader loaded={this.state.loaded}>
                <form onSubmit={this.submit}className="col s6">
                  <h5>Video Submission</h5>
                  <h6>We will send you a text when its done!</h6>
                  <br/>
              
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
                <div className="col s6">
                  <video autoPlay='true'ref='video2' width="400" height="400" />
                  <audio ref='audio' autoPlay='true' />
                </div>
              </Loader>
            </div>
          </div>
        </div>
      </div>
    )
  }
})


module.exports = Record;