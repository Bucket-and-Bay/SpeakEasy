var React = require('react');
var helpers = require('../config/helper.js');


var Signup = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    if(this.refs.password.value.length > 0 || this.refs.username.value.length > 0 || this.refs.email.value > 0){

      if(this.refs.password.value === this.refs.confirm.value){

        var user = {
          username: this.refs.username.value,
          password: this.refs.password.value,
          email: this.refs.email.value,
          first: this.refs.firstname.value,
          last: this.refs.lastname.value
        }
      
        helpers.signup(user).then(function(response){
          if(response.status === 201){
            //redirect to dashboard
            localStorage.token = user.username;
            this.props.history.transitionTo({
              pathname: '/dashboard',
              search: '?a=query',
            })
          } else {
            alert('username taken');
          }
        }.bind(this));
      } else {
        alert('passwords do not match');
      }
    } else {
      alert('please enter a valid username, password, and email');
    }
  },
  render: function() {
    return (
      <div>
        <div id='signin'className="row container">
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="input-field col s6">
              <input ref="firstname"placeholder="First Name" id="first_name" type="text" className="validate" />
            </div>
            <div className="input-field col s6">
              <input ref="lastname" placeholder="Last Name" id="last_name" type="text" className="validate" />
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input placeholder="Username" ref="username"id="username" type="text" className="validate" />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input ref="email" placeholder="Email" id="email" type="email" className="validate" />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input placeholder="Password" id="password" ref="password" type="password" className="validate" />
              </div>
              <div className="input-field col s12">
                <input ref="confirm"placeholder="Confirm Password" id="confirm_password" type="password" className="validate" />
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
      </div>
    )
  }
});

module.exports = Signup;