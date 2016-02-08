var React = require('react');
var Auth = require('../config/Auth.js');
var Logo = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: Auth.isLoggedIn(),
    }
  },
  writeLogo: function(){
    if (this.state.loggedIn){
      return [
         <div className="cname_wrapper">
          <div className="cname-title big">
              <div className="cname-title big s"></div>
          </div>
         </div>
      ]
    }else{
      return [
      <div className="cname_wrapper">
        <div className="cname-title big">
          <div className="cname-title big s"></div>
        </div>
        <div className="cname-title big">
          <div className="cname-title big p"></div>
        </div>
        <div className="cname-title big">
          <div className="cname-title e">
          <div className="e-half big"></div>
          </div>     
        </div>
        <div className="cname-title big">
          <div className="cname-title big a"></div>
        </div>
        <div className="cname-title big">
          <div className="cname-title big k"></div>
        </div>
        <div className="cname-title big">
          <div className="cname-title e">
          <div className="e-half big"></div>
          </div>     
        </div>
        <div className="cname-title big">
          <div className="cname-title big a"></div>
        </div>
        <div className="cname-title big">
          <div className="cname-title big s"></div>
        </div>
        <div className="cname-title big">
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