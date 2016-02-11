var React = require('react');
var Video = require('./Video.js');
var helper = require('../config/helper.js');
var Searchbar = require('./Searchbar.js');


var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      video: [],
      userVideos: []
    }
  },

  componentDidMount: function(){
    helper.getUserVideos().then(function(response){
      this.setState({
        video: response.data,
        userVideos: response.data
      })
    }.bind(this))
  },

  onSearch: function(query) {
    var results = [];
    if(query === '') {
      this.setState({ video: this.state.userVideos })
    } else {
      this.state.userVideos.forEach(function(item) {
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
  delete: function(index, videoID){
    var confirm = window.confirm("Are you sure you want to delete this?")
    if(confirm){
      var videos = this.state.userVideos
      for(var i = 0; i < videos.length; i++){
        if(this.state.video[index] === videos[i]){
          delete videos[i];
          break
        }
      }
      var currentVideos = this.state.video;
      delete currentVideos[index]
      this.setState({
        video: currentVideos,
        userVideos: videos
      })
      helper.deleteVideo(videoID)
        .then(function(response){
          console.log('successfully deleted from database')
        })
    } 
  },
  render: function(){
    return (
    <div>
      <div className="container"> 
        <div className="row">
          <Searchbar className="col s12" onSearch={ this.onSearch } />
          <a href="#/upload" data-position="top" data-tooltip="Upload a video from your computer" className="btn-offset col s3 waves-effect waves-light btn tooltipped">Upload<i className="fa fa-upload"></i></a>
          <a href="#/record" data-position="top" data-tooltip="Record a video right here." className="col s3 offset-s1 waves-effect waves-light btn tooltipped">Record<i className="fa fa-video-camera"></i></a>
          <a href="#/public" data-position="top" data-tooltip="Comment on public vidoes." className="col s3 offset-s1 waves-effect waves-light btn tooltipped">Speak Up<i className="fa fa-bullhorn"></i></a>
        </div>
        <div className="row">
        <Video delete={this.delete} data={this.state.video}/>
        </div>
      </div>
    </div>
    )
  }
});

module.exports = Dashboard;

