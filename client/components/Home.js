var React = require('react');

var Home = React.createClass({
  render: function(){
    return (
    <div>
      <div id="index-banner" className="parallax-container">
        <div className="section no-pad-bot">
          <div className="container">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h1 className="header center white-text text-lighten-2">Learn to give motivating speeches</h1>
            <div className="row center">
              <h5 className="header col s12 light">Improve your speeches dramatically</h5>
            </div>
            <div className="row center">
              <a href="#/signin" id="download-button" className="btn-large waves-effect waves-light teal lighten-1">Get Started</a>
            </div>
          </div>
        </div>
        <div className="parallax"><img src="main_1200.jpg" alt="Unsplashed background img 1"/></div>
      </div>

      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col s12 m4">
              <div className="icon-block">
                <h2 className="center blue-text"><i className="material-icons">videocam</i></h2>
                <h5 className="center">Easy to Use</h5>

                <p className="light">Submit a video recording of yourself or take one on the spot. Just upload the videos you want and we'll send you a text when it's done.</p>
              </div>
            </div>
            <div className="col s12 m4">
              <div className="icon-block">
                <h2 className="center blue-text"><i className="material-icons">group</i></h2>
                <h5 className="center">Community Driven</h5>

                <p className="light">Recieve comments and tips from our community to help you improve! Please no internet trolls, you will be ban hammered</p>
              </div>
            </div>

            <div className="col s12 m4">
              <div className="icon-block">
                <h2 className="center blue-text"><i className="material-icons">speaker_notes</i></h2>
                <h5 className="center">Speech Analysis</h5>

                <p className="light">Get analysis on the emotions you portray when speaking as well as the contents of your speech. Speech and tone analyzation on content of your speechs to help you give positive upbeat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
})

module.exports = Home;