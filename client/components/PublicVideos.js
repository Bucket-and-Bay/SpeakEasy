var React = require('react');
var Navbar = require('./Navbar.js');
var Searchbar = require('./Searchbar.js');

var PublicVideos = React.createClass({

  render: function() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <Searchbar onSearc={ this.onSearch } />
          <div className="row">
            <p> Videos here </p>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = PublicVideos;




/*
  XAdd to client routes.js and on navbar
  Add client helper function to get all public videos
  Add server route to get all public videos
  Add server helper function to query and return all public vids
  Add Comments page for single video
  
  <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col s8">
            <VideoPlayer data={this.state.videoSource} />
          </div>
        <div className="col s4">
          <div className="video-info">
            <h4>{this.state.videoTitle}</h4>
            <p>{this.state.videoDate}</p>
            <Switch data={this.state} />
          </div>
        </div>
      </div>
    </div>


*/