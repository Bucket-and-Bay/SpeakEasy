var React = require('react');
var Navbar = require('./Navbar.js');
var Searchbar = require('./Searchbar.js');
var helper = require('../config/helper.js');

var PublicVideos = React.createClass({
  getInitialState: function() {
    return {
      videos: [],
      publicVideos: []
    }
  },

  componentDidMount: function(){
    helper.getPublicVideos().then(function(response){
      console.log(response, 'RESPONSE FROM HELPER.GPV')
      this.setState({
        video: response.data,
        publicVideos: response.data
      })
    }.bind(this))
  },

  onSearch: function(query) {
    var results = [];
    if(query === '') {
      this.setState({ video: this.state.publicVideos })
    } else {
      this.state.publicVideos.forEach(function(item) {
        if (!item.title || !item.description) {
          return;
        }
        var title = item.title.toLowerCase();
        var description = item.description.toLowerCase();
        query = query.toLowerCase();
        if(title.indexOf(query) !== -1 || description.indexOf(query) !== -1) {
          results.push(item);
        }
      });
      this.setState({ video: results });
    }
  },

  render: function() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <Searchbar onSearch={ this.onSearch } />
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
  Make PublicVideoItem component
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