var React = require('react');

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {
      var location = "#/analysis/" + item._id
      return <div key={idx}><a id="photo" href={location}><image src={item.thumbnail_url} /></a></div>
    });
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;