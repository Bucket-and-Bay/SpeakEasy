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
      beyondVerbalDataCompPrimary: [],
      beyondVerbalDataCompSecondary: [],
      beyondVerbalDataGroup11: [],
      watsonFullScript: '',
      alchemyAPIKeywordsText: [],
      alchemyAPIKeywordsRelevance: [],
      alchemyAPIKeywordsSentiment: [],
      atvArousal: [],
      atvTemper: [],
      atvValence: [],
      moodComposites: [],
      wpmWatson: 0,
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
          console.log(response.data);
          var videoDate = response.data.date.slice(0, 10);
          var videosource = response.data.videoUrl;

          // Kairos
          var analysis = response.data.kairosAnalysis.frames;
          var kairosAnalysisData = helpers.getEmotionData(analysis);

          // Beyond Verbal
          var bvData = response.data.beyondVerbalAnalysis[0].result;
          var beyondVerbalAnalysisData = helpers.getBeyondVerbalData(bvData);

          // Watson Script and words per minute
          var watsonScript = response.data.watsonAnalysis[1];
          var wpm = helpers.wpmWatson(watsonScript, response.data.kairosAnalysis.length);

          // Alchemy API
          var alchemyData = response.data.alchemyAnalysis;
          var alchemyAPIKeywordsText = helpers.getAlchemyKeywordsText(alchemyData);
          var alchemyAPIKeywordsRelevance = helpers.getAlchemyKeywordsRelevance(alchemyData);
          var alchemyAPIKeywordsSentiment = helpers.getAlchemyKeywordsSentiment(alchemyData);

          this.setState({
            videoSource: videosource,
            videoTitle: response.data.title,
            videoDate: videoDate,
            beyondVerbalDataCompPrimary: beyondVerbalAnalysisData.moodDataCompPrimary,
            beyondVerbalDataCompSecondary: beyondVerbalAnalysisData.moodDataCompSecondary,
            beyondVerbalDataGroup11: beyondVerbalAnalysisData.moodDataGroup11,
            watsonFullScript: watsonScript,
            alchemyAPIKeywordsText: alchemyAPIKeywordsText,
            alchemyAPIKeywordsRelevance: alchemyAPIKeywordsRelevance,
            alchemyAPIKeywordsSentiment: alchemyAPIKeywordsSentiment,
            atvArousal: beyondVerbalAnalysisData.summary['arousal'],
            atvTemper: beyondVerbalAnalysisData.summary['temper'],
            atvValence: beyondVerbalAnalysisData.summary['valence'],
            moodComposites: beyondVerbalAnalysisData.moodDataGroup11,
            wpmWatson: wpm,

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
                legend: {
                  backgroundColor: '#FFFFFF',
                  layout: 'vertical',
                  floating: true,
                  align: 'right',
                  verticalAlign: 'bottom',
                  x: -30,
                  y: -60,
                  shadow: true
                },

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
                },
                {
                  data: beyondVerbalAnalysisData.audioQData,
                  name: 'Audio Quality',
                  visible: false
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
                    y: beyondVerbalAnalysisData.finalDataGroup11['Self-Control, Practicality'] || null
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
          <Tabs onSelect={this.handleSelect} selectedIndex={4}>

            <TabList>
              <Tab>Kairos Video Analysis</Tab>
              <Tab>Beyond Verbal Analysis</Tab>
              <Tab>Verbal Mood Groups</Tab>
              <Tab>Watson</Tab>
              <Tab>AlchemyAPI</Tab>
              <Tab>Comments</Tab>
            </TabList>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                  Analyze and understand facial expressions and engagement in most videos.
                  We look for faces in your footage and pass the facial features and expressions through our Emotion Algorithms.
                  Every 250ms we will return values for things like "smile", "surprise", "negative" and "attention".
                  This helps you figure out how someone might be feeling.
              </div>
              <Graph className="row col s12" data={this.state.kairosAnalysis}/>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                *BETA
                Valence is an output which measures speaker’s level of negativity / positivity.
                The Valence output is divided into two distinct measurements:
                Continuous Scale ranging from 0 to 100, representing a valence shift from negative attitude at the
                lower part of the scale to a positive attitude at the higher part of the same scale.
                Valence groups which consist of three distinct groups: Negative, Neutral and Positive.
              </div>
              <Graph data={this.state.beyondVerbalAnalysis}/>
              <h5 className="row col s12 center-align">Scroll down to read what your results mean</h5>

              <div className="row">
                <div className="col s4 center-align card-panel hoverable">
                  <p><img className="col s12" src="arousal.png"/>
                  Your Arousal was {this.state.atvArousal[0]}</p>
                  <hr/>
                  <p>{this.state.atvArousal[1]}</p>
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  <p><img className="col s12" src="temper.png"/>
                  Your Temper was {this.state.atvTemper[0]}</p>
                  <hr/>
                  <p>{this.state.atvTemper[1]}</p>
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  <p><img className="col s12" src="valence.png"/>
                  Your Valence was {this.state.atvValence[0]}</p>
                  <hr/>
                  <p>{this.state.atvValence[1]}</p>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                Mood groups are an indicator of a speaker’s emotional state during the analyzed voice section.
                There are 432 combined emotions which are grouped into eleven main mood groups.
                Mood groups are distinct outputs and not measured in a scale.
              </div>
              <h5>Mood Composites</h5>
              <div className="row">
                <div className="col s6 center-align card-panel hoverable">
                  <p>Your Primary Mood Composites</p>
                  <hr/>
                  <p>{this.state.beyondVerbalDataCompPrimary}</p>
                </div>
                <div className="col s6 center-align card-panel hoverable">
                  <p>Your Secondary Mood Composites</p>
                  <hr/>
                  <p>{this.state.beyondVerbalDataCompSecondary}</p>
                </div>
              </div>

              <hr/>
              <h5>Mood Groups</h5>
              <Graph data={this.state.moodGroup11Analysis}/>
              <div className="row">
                {this.state.moodComposites.map(function (item) {
                  return <div className="col s5 offset-s1 center-align card-panel hoverable">
                      <p>{item[0]}</p>
                    <hr/>
                    <p>{item[1]}</p>
                  </div>
                })}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                This is your whole script back from Alchemy API. Do Words per minute here
              </div>
            <h5>The Full Script</h5>
              {this.state.watsonFullScript}
              <hr/>
              <div className="card-panel hoverable">
                <p>
                  The  average American English speaker engaged in a friendly
                  conversation speaks at a rate of approximately 110–150 words per minute.
                </p>
                <p>
                  Your words per minute were: <b>{this.state.wpmWatson}</b>
                </p>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                Make a treemap and table of the keywords and their sentiment and relevance and click to see website
              </div>
              <h5>Alchemy</h5>

              <div className="row">
                <table className="striped bordered col s4">
                  <tbody>
                    <tr>
                      <td><b>Keyword</b></td>
                    </tr>
                    {this.state.alchemyAPIKeywordsText.map(function (item) {
                      return <tr><td>{item}</td></tr>
                    })}
                  </tbody>
                </table>
                <table className="striped bordered col s4">
                  <tbody>
                    <tr>
                      <td><b>Relevance</b></td>
                    </tr>
                    {this.state.alchemyAPIKeywordsRelevance.map(function (item) {
                      return <tr><td>{item}</td></tr>
                    })}
                  </tbody>
                </table>
                <table className="striped bordered col s4">
                  <tbody>
                    <tr>
                      <td><b>Sentiment</b></td>
                    </tr>
                    {this.state.alchemyAPIKeywordsSentiment.map(function (item) {
                      if (item === 'negative') {
                        return <tr><td><font color="red">{item}</font></td></tr>
                      } else if (item === 'positive') {
                        return <tr><td><font color="green">{item}</font></td></tr>
                      } else {
                        return <tr><td>{item}</td></tr>
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel light-blue">
                Comments that the public has put on your video
              </div>
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
