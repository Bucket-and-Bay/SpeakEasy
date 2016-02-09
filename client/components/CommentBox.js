var React = require('react');
var Infinite = require('react-infinite');
var moment = require('moment');
var helpers = require('../config/helper.js');

var Comment = React.createClass({
  render: function() {
    var date = this.props.date;
    var relativeTime = moment(date).fromNow();
    return (
      <div className="comment row">
        <div className="comment-heading col s2">
          <p className="comment-author">{this.props.author}</p>
          <p className="relative-time">{relativeTime}</p>
        </div>
        <div className="comment-content col s10">
          {this.props.text}
        </div>
      </div>      
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return { 
      data: [],
      interval: []
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.data){
      this.setState({ data: nextProps.data });
    }
    
  },

  componentWillMount: function() {
    var videoId = this.props.videoId;
    var that = this;
    this.state.interval.push(setInterval(function(){
        helpers.getVideoComments(videoId).then(function(response){
          that.setState({ data: response.data[0].comments })
          }.bind(that))}, 7000)
    )
  },

  componentWillUnmount: function() {
    this.state.interval.forEach(clearInterval);
  },

  handleCommentSubmit: function(videoId, author, text) {
    var comments = this.props.data;
    var comment = {
      videoId: videoId,
      author: author,
      text: text
    }
    helpers.submitComment(videoId, author, text);
    helpers.getVideoComments(videoId)
      .then(function(response){
        this.setState({
          data: response.data[0].comments
        })
      }.bind(this))
  },

  render: function() {
    return (
      <div className="commentBox">
        <h4 className="comment-header">Comments</h4>
          <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} videoId={this.props.videoId} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, idx) {
      return (
          <Comment author={comment.username} date={comment.date} text={comment.text} key={idx}>
            {comment.text}
          </Comment>
      );
    });
    return (
      <div className="commentList">
        <Infinite className="comment-container" containerHeight={300} elementHeight={50} >
          {commentNodes}
        </Infinite>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {
      author: '',
      text: '',
      videoId: '',
      date: ''
    }
  },

  componentDidMount: function() {
    this.setState({
      author: 'user',
      text: this.props.text,
      videoId: this.props.videoId
    })
  },

  handleTextChange: function(e) {
    this.setState({ text: e.target.value });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if(!text) {
      return;
    }
    this.props.onCommentSubmit(this.state.videoId, this.state.author, this.state.text);
    this.setState({
      text: ''
    });
  },

  render: function() {
    return (
      <div className="row">
        <form className="col s12 commentForm" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">mode_edit</i>
              <input type="text" value={this.state.text} onChange={this.handleTextChange} id="icon_prefix2" className="materialize-textarea" placeholder="Leave comment..."></input>
              <label htmlFor="icon_prefix2"></label>
              <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
});

module.exports = CommentBox;