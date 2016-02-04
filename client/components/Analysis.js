var React = require('react');
var Graph = require('./Graph.js');
var helpers = require('../config/helper.js');
var VideoPlayer = require("./VideoPlayer.js");
var Navbar = require('./Navbar.js');
//var Tabs = require('react-simpletabs');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;


var Analysis = React.createClass({

  getInitialState: function(){
    return {
      videoSource: '',
      videoTitle: '',
      videoDate: '',
      analysis: {},
      analysisTwo: {}
    }
  },

  componentDidMount: function(){
    var that = this;

    helpers.getVideoAnalysis(this.props.params.videoID)
      .then(function(response){
        console.log(response);
        var analysis = response.data.kairosAnalysis.frames;
        var videosource = response.data.videoUrl;
        var videoDate = response.data.date.slice(0, 10);
        var analysisData = helpers.getEmotionData(analysis);
        //analysisData.attentionData
        this.setState({
          videoSource: videosource,
          videoTitle: response.data.title,
          videoDate: videoDate,
          analysis: {
            title: {
              text: 'Emotional Video Analysis'
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            series:[{
              data: analysisData.attentionData,
              name: 'attention',
              visible: false
            },
              {
                data: analysisData.negativeData,
                name: 'negative'
              },
              {
                data: analysisData.smileData,
                name: 'smile'
              },
              {
                data: analysisData.surpriseData,
                name:'surprise'
              }]
          },
          analysisTwo: {
            title: {
              text: 'Audio Analysis'
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            series:[{
              data: analysisData.attentionData,
              name: 'blue',
              visible: false
            },
              {
                data: analysisData.negativeData,
                name: 'black'
              },
              {
                data: analysisData.smileData,
                name: 'green'
              },
              {
                data: analysisData.surpriseData,
                name:'orange'
              }]
          }
        })
      }.bind(this))
  },
  render: function() {
    return (
      <div>
      <Navbar />
      <div className="container">
      <div className="row">
      <div className="col s8">
      <VideoPlayer data={this.state.videoSource} />
    </div>
    <div className="col s4">
      <div className="video-info">
      <h4>{this.state.videoTitle}</h4>
    <p>{this.state.videoDate}</p>
    </div>
    </div>

    </div>
    <div className="col 12">

      <Tabs onSelect={this.handleSelect} selectedIndex={1}>

      <TabList>
      <Tab>Emotional Video Analysis</Tab>
    <Tab>Audio Analysis</Tab>
    <Tab>Test 3</Tab>
    <Tab>Comments</Tab>
    </TabList>

    <TabPanel>
    <Graph className="col s12" data={this.state.analysis}/>
    </TabPanel>
    <TabPanel>
    <Graph className="col s12" data={this.state.analysisTwo}/>
    </TabPanel>
    <TabPanel>
    <h2>Test 3</h2>
    </TabPanel>
    <TabPanel>
    <h2>Comments</h2>
    </TabPanel>
    </Tabs>
    </div>
    </div>
    </div>
    )
  }
});

module.exports = Analysis;

