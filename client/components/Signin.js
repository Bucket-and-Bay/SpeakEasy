var React = require('react');

var Signin = React.createClass({
  render: function() {
    return (
      <div className="row">
        <form className="col s12">
          <div className="row">
            <div className="input-field col s8">
              <input placeholder="Username" id="username" type="text" className="validate" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8">
              <input placeholder="Password" id="password" type="password" className="validate" />
            </div>
          </div>
          <div className="row">
              <p>Not registered? <a href="#/signup">SignUp...</a></p>
          </div>
        </form>
        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
      </div>
    )
  }
});

module.exports = Signin;