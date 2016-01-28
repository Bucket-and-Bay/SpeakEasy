var React = require('react');
var helpers = require('../config/helper.js');

function videoError(){
  console.log('error')
};
var Record = React.createClass({

  componentDidMount: function(){
    var video = this.refs.video;
    var audio = this.refs.audio;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if(navigator.getUserMedia){
      navigator.getUserMedia({video: true, audio: true}, function(stream){
   
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e){
          console.log('lol')
        }
      }, videoError)
    }

  },
  render:function(){
    return(
      <div>
        <video autoPlay="true" ref='video'width="700" height="400" muted>
      
        </video>
      </div>
    )
  }
})


module.exports = Record;