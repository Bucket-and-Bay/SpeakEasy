var React = require('react');
var helper = require('../config/helper.js')

var Main = React.createClass({
  logout: function(e){
    delete localStorage.token;
    helper.logout();
  },
  render: function() {
    return (
      <div className="main-container">
        <nav>
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">SpeakEasy</a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="#/record">Record a Video</a></li>
              <li><a href="#/dashboard">Your Videos</a></li>
              <li><a href="#/signin" onClick={this.logout}>Logout</a></li>
            </ul>
          </div>
        </nav>
        
        <div className="container">{this.props.children}</div>

        <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Footer Content</h5>
                <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Links</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 1</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 3</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 4</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            © 2014 Copyright Text
            <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});  

module.exports = Main;