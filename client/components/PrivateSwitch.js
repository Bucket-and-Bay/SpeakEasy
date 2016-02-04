var React = require('react');
var helper = require('../config/helper.js');

var PrivateSwitch = React.createClass({

  getInitialState: function() {
    console.log(this.props.data, 'Initial state data from analysis')
    return {
      isPrivate: this.props.data.isPrivate,
      videoId: this.props.data.videoId
    }
  },

  componentWillMount: function() {
    this.setState({
      isPrivate: this.props.data.isPrivate,
      videoId: this.props.data.videoId
    })
  },

  handleClick: function(e) {
    console.log('isPrivate', this.state.isPrivate);
    console.log('checked', e.target.checked);
    this.setState({ isPrivate: e.target.checked });
    helper.putPrivacy(this.state.isPrivate, this.state.videoId);
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
              />
              <span className="lever"></span>
              Public
            </label>
      </div>
    )
  }
});

module.exports = PrivateSwitch;