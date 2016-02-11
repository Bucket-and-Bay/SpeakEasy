var React = require('react');
var Searchbar = require('./Searchbar.js');
var helper = require('../config/helper.js');
var PublicVideoItem = require('./PublicVideoItem.js');

var PublicVideos = React.createClass({
  getInitialState: function() {
    return {
      videos: [],
      publicVideos: []
    }
  },

  componentDidMount: function(){
    window.analytics.page('Video Comment Page');
    helper.getPublicVideos().then(function(response){
      this.setState({
        videos: response.data,
        publicVideos: response.data
      })
    }.bind(this))
  },

  onSearch: function(query) {
    var results = [];
    if(query === '') {
      this.setState({ videos: this.state.publicVideos })
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
      this.setState({ videos: results });
    }
  },

  render: function() {
    return (
      <div>
        <div className="container">
          <Searchbar onSearch={ this.onSearch } />
          <div className="row">
            <PublicVideoItem data={this.state.videos} />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = PublicVideos;
