var React = require('react');


// will contain VideoFrame, VideoInfo, Graphs components
var Analysis = React.createClass({
  render: function() {
    return (
      <div >
        <div className="row">
            <div className="video-frame">
              <video width="700" height="400" controls>
               <source src="http://cdn.streamable.com/video/mp4/t0qb.mp4" type="video/mp4"/>
                Your browser does not support the eo tag.
               </video>
             </div>
             <div className="video-info">
                <h4>Project Title</h4>
                <p>Date updated: January 22, 2016</p>
             </div>
        </div>
        <div className="graph">
          <image src="http://i0.wp.com/analyzecore.com/wp-content/uploads/2014/04/plot.jpg" />
        </div>
      </div>
    )
  }
});

module.exports = Analysis;