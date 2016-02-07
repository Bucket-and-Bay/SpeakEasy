var React = require('react');
var helper = require('../config/helper.js');
var Auth = require('../config/Auth.js');
// var NavWrapper = require('react-materialize').Navbar;
// var NavItem = require('react-materialize').NavItem;
var BootBar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem

var Navbar = React.createClass({
  // componentDidMount: function(){
  //   if ($ !== undefined) {
  //     $('.button-collapse').sideNav();
  //     
  //   }
  // },
  getInitialState: function(){
    return {
      loggedIn: Auth.isLoggedIn(),
      dropdownVisible: false
    }
  },
  logout: function(e){

    delete localStorage.token;
    helper.logout();
  },
  buttons: function(){
    if(this.state.loggedIn){
    return [<NavItem eventKey={1} href="#/upload">Upload a Video</NavItem>, <NavItem eventKey={2} href="#/record">Record a Video</NavItem>,  <NavItem eventKey={3} href="#/dashboard">Your Videos</NavItem>, <NavItem eventKey={4} href="#/public">Public Videos</NavItem>, <NavItem eventKey={5} href="#/signin" onClick={this.logout}>Logout</NavItem>]
    } else {
      return [<NavItem eventKey={1} href="#/signup">Signup</NavItem>, <NavItem eventKey={2}  href="#/signin">Log In</NavItem>]
    }
  },
  dropdown:function(event){
    this.setState({dropdownVisible: !this.state.dropdownVisible});
  },
  // render: function(){
  //   var dropdownVisible = this.state.dropdownVisible ? 'visible' : 'hidden';
  //   return (
  //     <nav>
  //       <div className="nav-wrapper">
  //         <a href="#" className="brand-logo">SpeakEasy</a>  
  //         <ul id="mobile-nav-wrap" className="right">
  //           <li>
  //             <a id="menu-button" onMouseOver={this.dropdown} onMouseOut={this.dropdown} className="white-text button-collapse right dropdown-button">
  //                <i className="material-icons">menu</i>
  //             </a>
  //           </li>
  //           <li className={dropdownVisible}>
  //             <ul id="mobile-nav" className="blue-grey"> 
  //                 {this.buttons()}
  //             </ul>  
  //           </li>
  //         </ul>  
  //         <ul id="full-nav"  className="right hide-on-med-and-down">
  //             {this.buttons()}
  //         </ul>  
  //       </div>
  //     </nav>
  //   )
  // }
  render:function(){
    return (
    // <div className="container">
    <BootBar inverse>
    <BootBar.Header>
      <BootBar.Brand>
        <a href="#">React-Bootstrap</a>
      </BootBar.Brand>
      <BootBar.Toggle />
    </BootBar.Header>
    <BootBar.Collapse>
      <Nav className="right">
        {this.buttons()}
      </Nav>
    </BootBar.Collapse>
  </BootBar>
  // </div>
    )
  }
  // render:function(){
  //   return (
  //     <nav className='flex-container'>
  //        <a href="#" className="brand-logo center">SpeakEasy</a> 
  //         <NavWrapper id="mobile-nav" right> 
  //           <div className="left">   
  //            {this.buttons()}
  //           </div>
  //         </NavWrapper>
  //     </nav>
  //     )
  // }
});

module.exports = Navbar;