var React = require('react');



var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h5 className="commentAuthor">
          {this.props.author}
        </h5>
        {this.props.children}
      </div>      
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.props.data}/>
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
          <Comment author={comment.author} key={comment.id}>
            {comment.text}
          </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Comment Form here
      </div>
    )
  }
});



module.exports = CommentBox;