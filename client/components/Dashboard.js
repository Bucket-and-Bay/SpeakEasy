var React = require('react');
var Video = require('./Video.js');
var VideoInput = require('./VideoInput.js');
var helper = require('../config/helper.js');
var Searchbar = require('./Searchbar.js');


var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      video: []
    }
  },

  componentDidMount: function(){
    
    helper.getUserVideos().then(function(response){
      this.setState({
        video: response.data
      })
    }.bind(this))
  },

  onSearch: function(query) {
    console.log(query, 'query results');
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

// this.props.data.forEach(function(video) {
//       if(video.title === queryText || video.description === queryText) {
//         results.push(video);
//       }
//     });