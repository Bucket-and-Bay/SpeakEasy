var React = require('react');

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {

      var date = new Date(item.date).toLocaleDateString() + " " + new Date(item.date).toLocaleTimeString();
      var location = "#/analysis/" + item._id
      return    <div className="col s4" key={idx}>
                  <div className="card hoverable small">
                    <a href={location}>
                      <div className="card-image">
                        
                        <image src={item.thumbnail_url}/>
                        <span className="card-title">{item.title}</span>
                      </div>
                    </a>
                    <div className="card-content">
                      <p>Description: {item.description}</p>
                    </div>
                    <div id='time'>
                      Timestamp: {date}
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

