var React = require('react');
var Graph = require('./Graph.js');
var helpers = require('../config/helper.js');
var VideoPlayer = require("./VideoPlayer.js");
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
      moodGroup11Analysis: {},
      beyondVerbalDataComp: [],
      beyondVerbalDataGroup11: [],
      watsonFullScript: '',
      alchemyAPIConcepts: [],
      atvArousal: [],
      atvTemper: [],
      atvValence: [],
      isPrivate: null,
      videoId: this.props.params.videoID
    }
  },

  componentDidMount: function(){

    helpers.getVideoAnalysis(this.props.params.videoID)
      .then(function(response){
        console.log(response)
        if(response.status === 401){
          this.props.history.transitionTo({
            pathname: '/public',
            search: '?a=query'
          })
        } else {
          console.log(response.data.beyondVerbalAnalysis);
          var videoDate = response.data.date.slice(0, 10);
          var videosource = response.data.videoUrl;

          // Kairos
          var analysis = response.data.kairosAnalysis.frames;
          var kairosAnalysisData = helpers.getEmotionData(analysis);

          // Beyond Verbal
          var bvData = response.data.beyondVerbalAnalysis[0].result;
          var beyondVerbalAnalysisData = helpers.getBeyondVerbalData(bvData);
          console.log(beyondVerbalAnalysisData.summary);

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
            atvArousal: beyondVerbalAnalysisData.summary['arousal'],
            atvTemper: beyondVerbalAnalysisData.summary['temper'],
            atvValence: beyondVerbalAnalysisData.summary['valence'],

            kairosAnalysis: {
                title: {
                  text: 'Kairos Video Analysis'
                },
                yAxis: {
                  title: {
                    text: ''
                  }
                },
                xAxis: {
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
                //legend: {
                //  backgroundColor: '#FFFFFF',
                //  layout: 'vertical',
                //  floating: true,
                //  align: 'right',
                //  verticalAlign: 'bottom',
                //  x: -30,
                //  y: -60,
                //  shadow: true
                //},

                chart: {
                  type: 'bar'
                },
                title: {
                  text: ''
                },
                yAxis: {
                  title: {
                    text: ''
                  }
                },
                xAxis: {
                  categories: ['Verbal Stats'],
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
              },
              moodGroup11Analysis: {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
                },
                title: {
                  text: 'Your voice emotions'
                },
                tooltip: {
                  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      }
                    }
                  }
                },
                series: [{
                  name: 'Mood',
                  colorByPoint: true,
                  data: [{
                    name: 'Supremacy, Arrogance',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Supremacy, Arrogance'] || null,
                    sliced: true,
                    selected: true
                  }, {
                    name: 'Hostility and Anger',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Hostility, Anger'] || null
                  }, {
                    name: 'Criticism and Cynicism',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Criticism, Cynicism'] || null
                  }, {
                    name: 'Self-control and Practicality',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Self-control, Practicality'] || null
                  }, {
                    name: 'Leadership and Charisma',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Leadership, Charisma'] || null
                  }, {
                    name: 'Creative and Passion',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Creative, Passionate'] || null
                  }, {
                    name: 'Friendliness and Warm',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Friendly, Warm'] || null
                  }, {
                    name: 'Love and Happiness',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Love, Happiness'] || null
                  }, {
                    name: 'Loneliness and Unfulfillment',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Loneliness, Unfulfillment'] || null
                  }, {
                    name: 'Sadness and Sorrow',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Sadness, Sorrow'] || null
                  }, {
                    name: 'Defensiveness and Anxiety',
                    y: beyondVerbalAnalysisData.finalDataGroup11['Defensivness, Anxiety'] || null
                  }]
                }]
              },
              isPrivate: response.data.isPrivate,
              videoId: response.data['_id']
            })
        }
      }.bind(this))
  },

  handleClick: function(e) {
    this.setState({ isPrivate: e.target.checked }, function(){
      helpers.putPrivacy(this.state.isPrivate, this.state.videoId);

    });
  },

  render: function() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col s8">
              <VideoPlayer data={this.state.videoSource} />
            </div>
          <div className="col s4">
            <div className="video-info">
              <h4>{this.state.videoTitle}</h4>
              <p>{this.state.videoDate}</p>
              <div className="switch">
                <label>
                  Public
                  <input type="checkbox" 
                    name="private" 
                    checked={this.state.isPrivate} 
                    onClick={this.handleClick} />
                  <span className="lever"/>
                  Private
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col 12">
          <Tabs onSelect={this.handleSelect} selectedIndex={1}>

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
              <Graph data={this.state.beyondVerbalAnalysis}/>
              <h5 className="row col s12 center-align">Scroll down to read what your results mean</h5>

              <div className="row">
                <div className="col s4 center-align card-panel hoverable">
                  Your Arousal was {this.state.atvArousal[0]}
                  <hr/>
                  {this.state.atvArousal[1]}
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  Your Temper was {this.state.atvTemper[0]}
                  <hr/>
                  {this.state.atvTemper[1]}
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  Your Valence was {this.state.atvValence[0]}
                  <hr/>
                  {this.state.atvValence[1]}
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h5>Mood Composite</h5>
              {this.state.beyondVerbalDataComp}
              <hr/>
              <h5>Mood Group</h5>
              <Graph data={this.state.moodGroup11Analysis}/>
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




// may use this later

//<div className="row">
//  <div className="col s2 offset-s3 arousal"><a><b>Arousal</b></a></div>
//  <div className="col s2 temper"><a><b>Temper</b></a></div>
//  <div className="col s2  valence"><a><b>Valence</b></a></div>
//</div>