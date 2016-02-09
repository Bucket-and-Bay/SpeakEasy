var React = require('react');
var VideoPlayer = require('./VideoPlayer.js');
var helpers = require('../config/helper.js');
var moment = require('moment');
var Infinite = require('react-infinite');

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
      data: []
    }
  },

  componentWillReceiveProps: function(nextProps) {
    console.log(nextProps.data, 'data')
    var that = this;
    if (nextProps.data){
      this.setState({ data: nextProps.data });
    }
    // setInterval(function(){
    //   helpers.getVideoComments(nextProps.videoId).then(function(response){
    //   that.setState({ data: response.data[0].comments })
    // }.bind(that))}, 7000)
  },

  handleCommentSubmit: function(videoId, author, text) {
    var comments = this.props.data;
    var comment = {
      videoId: videoId,
      author: author,
      text: text
    }
    var newComments = comments.concat([comment]);
    // this.setState({data: newComments});
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
      console.log(comment);
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

var PublicVideoComments = React.createClass({
  getInitialState: function(){
    return {
      videoSource: '',
      videoTitle: '',
      videoDate: '',
      videoId: this.props.params.videoID,
      username: '',
      comments: [],
      author: ''
    }
  },

  componentWillMount: function() {
    helpers.getVideoComments(this.props.params.videoID)
      .then(function(response){
        this.setState({
          videoSource: response.data[0].videoUrl,
          videoTitle: response.data[0].title,
          videoDate: response.data[0].date.slice(0,10),
          username: response.data[0].username,
          comments: response.data[0].comments
        })
      }.bind(this))
  },

  render: function() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col s8">
              <VideoPlayer data={this.state.videoSource} />
            </div>
          <div className="col s4">
            <div className="video-info">
              <h4>{this.state.videoTitle}</h4>
              <p>User: {this.state.username}</p>
              <p>Created: {this.state.videoDate}</p>
            </div>
          </div>
        </div>
        <div className="col 12">
          <CommentBox data={this.state.comments} author={this.state.author} videoId={this.state.videoId} />
        </div>
      </div>
      </div>
    )
  }
});

module.exports = PublicVideoComments;