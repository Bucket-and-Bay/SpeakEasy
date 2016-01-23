var React = require('react');

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {
      return <div key={idx}><a id="photo" href="#"><image src={item.image} /></a></div>
    });
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;