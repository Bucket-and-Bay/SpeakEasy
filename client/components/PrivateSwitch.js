var React = require('react');
var helper = require('../config/helper.js');

var PrivateSwitch = React.createClass({

  getInitialState: function() {
    return {
      isPrivate: this.props.data[0],
      videoId: this.props.data[1]
    }
  },

  handleClick: function(e) {
    console.log('isPrivate', this.state.isPrivate);
    console.log('checked', e.target.checked);
    this.setState({ isPrivate: e.target.checked });
    helper.putPrivacy(this.state.isPrivate, 313123);
  },

  render: function() {
    return (
      <div className="switch">
            <label>
              Private
              <input type="checkbox" 
                name={this.props.name} 
                checked={this.state.isPrivate} 
                onClick={this.handleClick} 
                value={this.props.value} />
              <span className="lever"></span>
              Public
            </label>
      </div>
    )
  }
});

module.exports = PrivateSwitch;