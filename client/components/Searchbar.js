var React = require('react');

var Searchbar = React.createClass({

  getInitialState: function() {
    return { 
      query: this.props.query || ''
    };
  },

  doSearch: function(event) {
    var newQuery = event.target.value || '';
    this.setState({ query: newQuery });
    this.props.onSearch.call(this, newQuery);
  },

  render: function() {
    return (
      <div className="searchbar">
        <input
         type="text"
         placeholder="Search..."
         value={ this.state.query }
         onChange={this.doSearch} />
      </div>
    );
  }
});

module.exports = Searchbar;