var React = require('react');
var Video = require('./Video.js');
var helper = require('../config/helper.js');
var Searchbar = require('./Searchbar.js');
var Navbar = require('./Navbar.js')

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
    } 
  },
  render: function(){
    return (
    <div>
     <Navbar />
      <div className="container">
        <Searchbar onSearch={ this.onSearch } />
        <div className="row">
        <Video delete={this.delete} data={this.state.video}/>
        </div>
      </div>
    </div>
    )
  }
});

module.exports = Dashboard;

