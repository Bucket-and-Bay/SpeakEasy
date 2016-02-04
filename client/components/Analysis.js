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
      kairosAnalysis: {},
      beyondVerbalAnalysis: {},
      beyondVerbalDataComp: [],
      beyondVerbalDataGroup11: [],
      watsonFullScript: '',
      alchemyAPIConcepts: []
    }
  },

  componentDidMount: function(){
    var that = this;

    helpers.getVideoAnalysis(this.props.params.videoID)
      .then(function(response){
        console.log(response.data.alchemyAnalysis);
        // date
        var videoDate = response.data.date.slice(0, 10);
        var videosource = response.data.videoUrl;

        // Kairos
        var analysis = response.data.kairosAnalysis.frames;
        var kairosAnalysisData = helpers.getEmotionData(analysis);

        // Beyond Verbal
        var bvData = response.data.beyondVerbalAnalysis[0].result;
        var beyondVerbalAnalysisData = helpers.getBeyondVerbalData(bvData);

        // Watson Script
        var watsonScript = response.data.watsonAnalysis[1];

        // Alchemy API
        var concepts = response.data.alchemyAnalysis;
        var conceptsData = helpers.getAlchemyData(concepts);

        this.setState({
          videoSource: videosource,
          videoTitle: response.data.title,
          videoDate: videoDate,
          beyondVerbalDataComp: beyondVerbalAnalysisData.moodDataComp,
          beyondVerbalDataGroup11: beyondVerbalAnalysisData.moodDataGroup11,
          watsonFullScript: watsonScript,
          alchemyAPIConcepts: conceptsData,
          kairosAnalysis: {
            title: {
              text: 'Kairos Video Analysis'
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            series:[{
              data: kairosAnalysisData.attentionData,
              name: 'attention',
              visible: false
            },
            {
              data: kairosAnalysisData.negativeData,
              name: 'negative'
            },
            {
              data: kairosAnalysisData.smileData,
              name: 'smile'
            },
            {
              data: kairosAnalysisData.surpriseData,
              name:'surprise'
            }]
          },
          beyondVerbalAnalysis: {
            chart: {
              type: 'bar'
            },
            title: {
              text: 'Beyond Verbal Analysis'
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            series:[{
              data: beyondVerbalAnalysisData.arousalData,
              name: 'Arousal'
            },
            {
              data: beyondVerbalAnalysisData.temperData,
              name: 'Temper'
            },
            {
              data: beyondVerbalAnalysisData.valenceData,
              name: 'Valence'
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
          <Tabs onSelect={this.handleSelect} selectedIndex={2}>

            <TabList>
              <Tab>Kairos Video Analysis</Tab>
              <Tab>Beyond Verbal Analysis</Tab>
              <Tab>Verbal Mood Groups</Tab>
              <Tab>Watson</Tab>
              <Tab>AlchemyAPI</Tab>
              <Tab>Comments</Tab>
            </TabList>

            <TabPanel>
            <Graph className="col s12" data={this.state.kairosAnalysis}/>
            </TabPanel>

            <TabPanel>
            <Graph className="col s12" data={this.state.beyondVerbalAnalysis}/>
            </TabPanel>

            <TabPanel>
              <h5>Mood Composite</h5>
              {this.state.beyondVerbalDataComp}
              <hr/>
              <h5>Mood Group</h5>
              {this.state.beyondVerbalDataGroup11}
            </TabPanel>

            <TabPanel>
            <h5>The Full Script</h5>
              {this.state.watsonFullScript}
            </TabPanel>

            <TabPanel>
              <h5>Alchemy</h5>
              {this.state.alchemyAPIConcepts}
            </TabPanel>

            <TabPanel>
            <p>When life gives you lemons, don’t make lemonade. Make life take the lemons back! Get mad! I don’t want your damn lemons, what the hell am I supposed to do with these? Demand to see life’s manager! Make life rue the day it thought it could give Cave Johnson lemons! Do you know who I am? I’m the man who’s gonna burn your house down! With the lemons! I’m gonna get my engineers to invent a combustible lemon that burns your house down!</p>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    </div>
    )
  }
});

module.exports = Analysis;

