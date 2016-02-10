var React = require('react');
var helper = require('../config/helper.js');
var Auth = require('../config/Auth.js');
var NavWrapper = require('react-materialize').Navbar;
var NavItem = require('react-materialize').NavItem;
var Dropdown = require('react-materialize').Dropdown
var Button = require('react-materialize').Button
var Logo = require('./Logo.js');

var Navbar = React.createClass({
  logout: function(e){

    delete localStorage.token;
    helper.logout();
  },
  buttons: function(){
    // console.log('LOGGED IN', this.state.loggedIn)
    if(Auth.isLoggedIn()){
    return [<NavItem key="1" href="#/upload">Upload a Video</NavItem>, <NavItem key="2"href="#/record">Record a Video</NavItem>,  <NavItem key="3" href="#/dashboard">Your Videos</NavItem>, <NavItem key="4" href="#/public">Public Videos</NavItem>, <NavItem key="5" href="#/signin" onClick={this.logout}>Logout</NavItem>]
    } else {
      return [<NavItem key="1" href="#/signup">Signup</NavItem>, <NavItem key="2" href="#/signin">Log In</NavItem>]
    }
  },
  render:function(){
    return (
      <nav>
        <div className="nav-wrap">
         <a href="#" className="brand-logo left">
          <Logo/>
         </a> 
          <div id="mobile-nav" className="right"> 
            <Dropdown className="right" trigger={
              <Button id="menu-wrap" className="transparent" right>
               <a className="teal-text">
                 <i className="material-icons">menu </i>
               </a>
              </Button>
             }> 
             {this.buttons()}
            </Dropdown>
          </div>
        </div>
      </nav>
    )
  }
});

module.exports = Navbar;