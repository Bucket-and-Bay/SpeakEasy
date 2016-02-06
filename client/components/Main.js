var React = require('react');
var helper = require('../config/helper.js')
var Navbar = require('./Navbar.js');
var Auth = require('../config/Auth.js');

var Main = React.createClass({

  render: function() {
    return (
      <div className="flex-wrapper">
        <div className="main-container">
          <div>{this.props.children}</div>
        </div>
        <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">About us</h5>
                 <ul>
                  <li><a className="grey-text text-lighten-3" href="#/about">The Team</a></li>
                  <li><a className="grey-text text-lighten-3" href="mailto:bucketandbay@gmail.com">Contact Us</a></li>
                  <li><a className="grey-text text-lighten-3" href="https://github.com/Bucket-and-Bay/SpeakEasy">Github</a></li>
                </ul>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">API's Used</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="https://www.kairos.com">Kairos</a></li>
                  <li><a className="grey-text text-lighten-3" href="http://www.beyondverbal.com">Beyond Verbal</a></li>
                  <li><a className="grey-text text-lighten-3" href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud">IBM Watson</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            Copyright © 2016 BucketAndBay
            </div>
          </div>
        </footer>
      </div>
    );
  }
});  

module.exports = Main;