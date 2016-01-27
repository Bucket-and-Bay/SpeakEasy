var React = require('react');
var Graph = require('./Graph.js');
var Helper = require('../config/helper.js');

// will contain VideoFrame, VideoInfo, Graphs components
var Analysis = React.createClass({
  componentDidMount(){
    var id = this.props.params.id;

    Helper.getAnalysisById(id)
    .then(function(response){
      this.setState({analysis:response});
    })

  },
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
          <Graph />
        </div>
      </div>
    )
  }
});

module.exports = Analysis;