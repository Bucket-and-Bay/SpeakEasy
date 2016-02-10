var React = require('react');

var Team = React.createClass({
  render: function(){
    return(
      <div>
        <div className="container">
          <div className="row">
            <div className="col l12">
              <h1 className="page-header">About Us </h1>      
              <p> How do you comfort a Javascript bug? You console log it. To understand recursion, you must first understand recursion. What do you call a computer that can sing? A Dell.</p>
            </div>
          </div>

          <div className="col 12">
            <h2 className="page-header">Our Team</h2>
          </div>
          <div className="row ">
            <div className="col s12 m6 l3 center-align">
              <a href=""><img className="circle responsive-img img-center hoverable" src="jason.jpg" alt="" /></a>
              <h3>Jason Jensen</h3>
              <medium>Full Stack Developer</medium>
              <p>All your base are belong to us.</p>
            </div>
            <div className="col s12 m6 l3 center-align">
              <a href=""><img className="circle responsive-img img-center hoverable" src="user.png" alt=""/></a>
              <h3>John Smith</h3>
              <medium>Job Title</medium>        
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
            <div className="col s12 m6 l3 center-align">
              <a href="https://github.com/Daigor"><img className="circle responsive-img img-center hoverable" src="Allan.png" alt="" /></a>
              <h3>Allan Trinh</h3>
              <medium>Full Stack Developer</medium>        
              <p>Comitting messages that make zero sense on the daily.</p>
            </div>
            <div className="col s12 m6 l3 center-align">
              <a href=""><img className="circle responsive-img img-center hoverable" src="tiffany.JPG" alt="" /></a>
              <h3>Tiffany Huang</h3>
              <medium>Full Stack Developer</medium>   
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
})



module.exports = Team;