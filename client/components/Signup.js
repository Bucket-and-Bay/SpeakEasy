var React = require('react');
var helpers = require('../config/helper.js');
var Signup = React.createClass({
  handleSubmit: function(e){
     e.preventDefault();
     console.log(this.refs.password.value);
     console.log(this.refs.username.value);
    var user = {
      username: this.refs.username.value,
      password: this.refs.password.value
    }
  
    helpers.signup(user).then(function(response){

      this.refs.username.value = '';
      this.refs.password.value = '';
    }.bind(this));
  },
  render: function() {
    return (
      <div className="row">
        <form className="col s12" onSubmit={this.handleSubmit}>
          <div className="input-field col s6">
            <input placeholder="First Name" id="first_name" type="text" className="validate" />
          </div>
          <div className="input-field col s6">
            <input placeholder="Last Name" id="last_name" type="text" className="validate" />
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Username" ref="username"id="username" type="text" className="validate" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Email" id="email" type="email" className="validate" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Password" id="password" ref="password" type="password" className="validate" />
            </div>
            <div className="input-field col s12">
              <input placeholder="Confirm Password" id="confirm_password" type="password" className="validate" />
            </div>
          </div>
          <div className="row">
            <p>Already have an account? <a href="#/signin">SignIn...</a></p>
          </div>
      
        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
        </form>
      </div>
    )
  }
});

module.exports = Signup;