// var React = require('react');
// var helpers = require('../config/helper.js');



// var Comment = React.createClass({
//   render: function() {
//     return (
//       <div className="comment">
//         <h5 className="commentAuthor">
//           {this.props.username}
//         </h5>
//         {this.props.children}
//       </div>      
//     );
//   }
// });

// var CommentBox = React.createClass({
//   getInitialState: function() {
//     return {data: []};
//   },

//   handleCommentSubmit: function(videoId, username, comment) {
//     var comments = this.state.data;
//     var newComments = comments.concat([comment]);
//     this.setState({data: newComments});
//     helpers.submitComment(videoId, username, data);
//   },

//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data}/>
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//       </div>
//     );
//   }
// });

// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function(comment) {
//       return (
//           <Comment username={comment.username} key={comment.id}>
//             {comment.text}
//           </Comment>
//       );
//     });
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });

// var CommentForm = React.createClass({
//   getInitialState: function() {
//     return {
//       username: '',
//       text: '',
//       date: ''
//     }
//   },

//   handleTextChange: function(e) {
//     this.setState({ text: e.target.value });
//   },

//   handleSubmit: function(e) {
//     e.preventDefault();
//     var text = this.state.text.trim();
//     if(!text) {
//       return;
//     }
//     this.props.onCommentSubmit({text: text})
//     this.setState({text: ''});
//   },

//   render: function() {
//     return (
//       <div className="row">
//         <form className="col s12 commentForm" onSubmit={this.handleSubmit}>
//           <div className="row">
//             <div className="input-field col s12">
//               <i className="material-icons prefix">mode_edit</i>
//               <input type="text" value={this.state.text} onChange={this.handleTextChange} id="icon_prefix2" className="materialize-textarea" placeholder="Leave comment..."></input>
//               <label htmlFor="icon_prefix2"></label>
//               <button className="btn waves-effect waves-light" type="submit" name="action">Submit
//                 <i className="material-icons right">send</i>
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     )
//   }
// });



// module.exports = CommentBox;