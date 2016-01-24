var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');

//image property
//video url property
//analysis of the video
//title
//associated user

var Dashboard = React.createClass({
  getInitialState: function() {
    var obj = {
      image: "http://cdn.streamable.com/image/t0qb.jpg",
      video: "http://cdn.streamable.com/video/mp4/t0qb.mp4",
      analysis: [{
        "person": {
          "time": 0,
          "person_id": "0",
          "emotions": {
            "smile": 1.82501,
            "surprise": 1.65042,
            "negative": 0.375578,
            "attention": 100
          }
        }
      }, {
        "person": {
          "time": 83,
          "person_id": "0",
          "emotions": {
            "smile": 1.76976,
            "surprise": 1.76893,
            "negative": 0.468632,
            "attention": 100
          }
        }
      }]
    }
    var array = [];
    for ( var i = 0; i < 5; i++) {
      array.push(obj);
    }
    return {
      video: array
    }
  },
  render: function(){
    return (
    <div className="row">
      <VideoInput />
       <Video data={this.state.video}/>
    </div>
    )
  }
});

module.exports = Dashboard;