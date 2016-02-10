var React = require('react');
var moment = require('moment');

var Video = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    delete: React.PropTypes.func.isRequired
  },
  handleClick: function(index, videoID){
    this.props.delete(index, videoID);
  },
  render: function() {
    var pictures = this.props.data.map(function(item, idx) {
      var date = moment(item.date).format('MMM Do YYYY, h:mm a');
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
                      Created: {date}
                      <button onClick={this.handleClick.bind(this, idx, item._id)} id="deletebutton">
                        <i id="trash"className="material-icons md-18 ">delete</i>
                      </button>
                    </div>

                  </div>
                </div>
    }.bind(this));
    return (
      <div>{pictures}</div>
    )
  }
});

module.exports = Video;

