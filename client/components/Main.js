var React = require('react');
var helper = require('../config/helper.js')
var Navbar = require('./Navbar.js');
var Auth = require('../config/Auth.js');

var Main = React.createClass({

  render: function() {
    return (
      <div className="flex-wrapper">
        <div className="main-container">
         <Navbar />
          <div>{this.props.children}</div>
        </div>
        <footer className="page-footer teal">
          <div>
            <div className="row">
              <div className="offset-s3 col s4 ">
                <h5 className="white-text">About us</h5>
                 <ul>
                  <li><a className="grey-text text-lighten-3" href="#/about">The Team</a></li>
                  <li><a className="grey-text text-lighten-3" href="mailto:bucketandbay@gmail.com">Contact Us</a></li>
                  <li><a className="grey-text text-lighten-3" href="https://github.com/Bucket-and-Bay/SpeakEasy">Github</a></li>
                </ul>
              </div>
              <div className="offset-s1 col s4 ">
                <h5 className="white-text">APIs Used</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="https://www.kairos.com">Kairos</a></li>
                  <li><a className="grey-text text-lighten-3" href="http://www.beyondverbal.com">Beyond Verbal</a></li>
                  <li><a className="grey-text text-lighten-3" href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud">IBM Watson</a></li>
                  <li><a className="grey-text text-lighten-3" href="http://www.alchemyapi.com/">AlchemyAPI</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright blue-grey darken-1 teal-text text-accent-1">
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