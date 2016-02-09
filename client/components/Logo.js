var React = require('react');
var Auth = require('../config/Auth.js');
var Logo = React.createClass({
  writeLogo: function(){
    if (Auth.isLoggedIn()){
      return [
         <div key="1" className="cname_wrapper">
          <div key="2" className="cname-title big">
              <div className="cname-title big s"></div>
          </div>
         </div>
      ]
    }else{
      return [
      <div key="1" className="cname_wrapper">
        <div className="cname-title big">
          <div className="cname-title big s"></div>
        </div>
        <div key="2" className="cname-title big">
          <div className="cname-title big p"></div>
        </div>
        <div key="3" className="cname-title big">
          <div className="cname-title e">
          <div className="e-half big"></div>
          </div>     
        </div>
        <div key="4" className="cname-title big">
          <div className="cname-title big a"></div>
        </div>
        <div key="5" className="cname-title big">
          <div className="cname-title big k"></div>
        </div>
        <div key="6" className="cname-title big">
          <div className="cname-title e">
          <div className="e-half big"></div>
          </div>     
        </div>
        <div key="7" className="cname-title big">
          <div className="cname-title big a"></div>
        </div>
        <div key="8" className="cname-title big">
          <div className="cname-title big s"></div>
        </div>
        <div key="9" className="cname-title big">
            <div className="cname-title big y"></div>
        </div>
      </div>]
    }
  },

  render: function(){
    return (
      <div id="logo-wrap">
        {this.writeLogo()}
      </div>
    )}
});

module.exports = Logo;