var React = require('react');
var Link = require('react-router').Link

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {
      return <div key={idx}><Link id="photo" to={"analysis"}><image src={item.thumbnail_url} /></Link></div>
    });
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;