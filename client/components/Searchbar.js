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
      <div id="searchbar" className="card-panel">
        <div className="input-field">
          <i className="material-icons prefix">search</i>
          <input
           type="text"
           placeholder="Search..."
           value={ this.state.query }
           onChange={this.doSearch} />
        </div>

      </div>
    );
  }
});

module.exports = Searchbar;