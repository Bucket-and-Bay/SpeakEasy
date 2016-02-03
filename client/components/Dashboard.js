var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');
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
    console.log(query, 'query results');
    var results = [];
    if(query === '') {
      this.setState({ video: this.state.userVideos })
    } else {
      this.state.userVideos.forEach(function(item) {
        if(item.title === query || item.description === query) {
          results.push(item);
        }
      });
      this.setState({ video: results });
    }
  },

  render: function(){
    return (
    <div className="container">
      <Searchbar onSearch={ this.onSearch } />
      <VideoInput />
      <div className="row">
      <Video data={this.state.video}/>
      </div>
    </div>
    )
  }
});

module.exports = Dashboard;

