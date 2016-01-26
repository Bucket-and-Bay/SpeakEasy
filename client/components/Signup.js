var React = require('react');

var Signup = React.createClass({
  render: function() {
    return (
      <div className="row">
        <form className="col s12">
          <div className="input-field col s6">
            <input placeholder="First Name" id="first_name" type="text" className="validate" />
          </div>
          <div className="input-field col s6">
            <input placeholder="Last Name" id="last_name" type="text" className="validate" />
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Username" id="username" type="text" className="validate" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Email" id="email" type="email" className="validate" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Password" id="password" type="password" className="validate" />
            </div>
            <div className="input-field col s12">
              <input placeholder="Confirm Password" id="confirm_password" type="password" className="validate" />
            </div>
          </div>
          <div className="row">
            <p>Already have an account? <a href="#/signin">SignIn...</a></p>
          </div>
        </form>
        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
      </div>
    )
  }
});

module.exports = Signup;