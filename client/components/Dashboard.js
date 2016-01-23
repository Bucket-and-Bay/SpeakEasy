var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');

var Dashboard = React.createClass({
  getInitialState: function() {
    var array = [];
    for ( var i = 0; i < 30; i++) {
      array.push('https://i.kinja-img.com/gawker-media/image/upload/s--2oOjJtqB--/c_fill,fl_progressive,g_center,h_180,q_80,w_320/18r4jm5tivy08jpg.jpg');
    }
    return {
      video: array
    }
  },
  render: function(){
    return (
    <div className="row">
      <VideoInput />
       <Video image={this.state.video}/>
    </div>
    )
  }
});

module.exports = Dashboard;