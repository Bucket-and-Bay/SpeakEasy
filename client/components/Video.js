var React = require('react');

var Video = React.createClass({
  propTypes: {
    image: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.image.map(function(item, idx) {
      return <div id="photo" key={idx}><image src={item} /></div>
    });
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;