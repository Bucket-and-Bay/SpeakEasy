var React = require('react');

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {
      var location = "#/analysis/" + item._id
      return    <div className="col s4" key={idx}>
                  <div className="card hoverable">
                    <a href={location}>
                      <div className="card-image">
                        <image src={item.thumbnail_url}/>
                        <span className="card-title">Video Title</span>
                      </div>
                    </a>
                    <div className="card-content">
                      <p>Description goes here</p>
                    </div>
                    <div className="card-action">
                      January 22, 2016
                    </div>
                  </div>
                </div>
    });
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;

