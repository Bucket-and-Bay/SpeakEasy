var React = require('react');
var helper = require('../config/helper.js');
var Auth = require('../config/Auth.js');

var Navbar = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: Auth.isLoggedIn()
    }
  },
  logout: function(e){

    delete localStorage.token;
    helper.logout();
  },
  buttons: function(){
    if(this.state.loggedIn){
      return [<li key='1'><a href="#/upload">Upload a Video</a></li>, <li key='2'><a href="#/record">Record a Video</a></li>,  <li key='3'><a href="#/dashboard">Your Videos</a></li>, <li key='4'><a href="#/public">Public Videos</a></li>, <li key='5'><a href="#/signin" onClick={this.logout}>Logout</a></li>]
    } else {
      return [<li key='1'><a href="#/signup">Signup</a></li>, <li key='2'><a href="#/signin">Log In</a></li>]
    }
  },
  render: function(){
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">SpeakEasy</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {this.buttons()}
          </ul>
        </div>
      </nav>
    )
  }
})

module.exports = Navbar;