var React = require('react');
var Graph = require('./Graph.js');
var helpers = require('../config/helper.js');
var VideoPlayer = require("./VideoPlayer.js");
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;
var CommentBox = require('./CommentBox.js');

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
    window.analytics.page('Analysis', {videoId: this.props.params.videoID});
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
          var kairosAnalysisData = response.data.kairosAnalysis || {}

          // Beyond Verbal
          var bvData = response.data.beyondVerbalAnalysis[0] 
          var beyondVerbalAnalysisData = bvData;
        
          // Watson Script and words per minute
          var watsonScript = response.data.watsonAnalysis[1];
          if(response.data.kairosAnalysis){
            var wpm = helpers.wpmWatson(watsonScript, response.data.kairosAnalysis.length);
          } else {
            //not correct, but for now its error checking
            var wpm = helpers.wpmWatson(watsonScript, 30)
          }

          // Alchemy API
          var alchemyAPIKeywordsText = response.data.alchemyAnalysis.alchemyAPIKeywordsText
          var alchemyAPIKeywordsRelevance = response.data.alchemyAnalysis.alchemyAPIKeywordsRelevance
          var alchemyAPIKeywordsSentiment = response.data.alchemyAnalysis.alchemyAPIKeywordsSentiment

          this.setState({
            videoSource: videosource,
            videoTitle: response.data.title,
            videoDate: videoDate,
            watsonFullScript: watsonScript,
            alchemyAPIKeywordsText: alchemyAPIKeywordsText,
            alchemyAPIKeywordsRelevance: alchemyAPIKeywordsRelevance,
            alchemyAPIKeywordsSentiment: alchemyAPIKeywordsSentiment,
            isPrivate: response.data.isPrivate,
            videoId: response.data['_id'],
            wpmWatson: wpm,
            kairosAnalysis: kairosAnalysisData,
          })
          if(beyondVerbalAnalysisData){
            this.setState({
              beyondVerbalDataCompPrimary: beyondVerbalAnalysisData.moodDataCompPrimary,
              beyondVerbalDataCompSecondary: beyondVerbalAnalysisData.moodDataCompSecondary,
              beyondVerbalDataGroup11: beyondVerbalAnalysisData.moodDataGroup11,
              atvArousal: beyondVerbalAnalysisData.summary['arousal'],
              atvTemper: beyondVerbalAnalysisData.summary['temper'],
              atvValence: beyondVerbalAnalysisData.summary['valence'],
              moodComposites: beyondVerbalAnalysisData.moodDataGroup11,
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
                    name: 'Energy',
                    color: 'rgba(103, 58, 183, 0.8)'
                  },
                  {
                    data: beyondVerbalAnalysisData.temperData,
                    name: 'Temper',
                    color: 'rgba(233, 30, 99, 0.8)'
                  },
                  {
                    data: beyondVerbalAnalysisData.valenceData,
                    name: 'Valence',
                    color: 'rgba(255, 152, 0, 0.8)'
                  },
                  {
                    data: beyondVerbalAnalysisData.audioQData,
                    name: 'Audio Quality',
                    visible: false,
                    color: 'rgba(0, 150, 136, 0.8)'
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
                      selected: true,
                      color: 'rgba(233, 30, 99, 1)'
                    }, {
                      name: 'Hostility and Anger',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Hostility, Anger'] || null,
                      color: 'rgba(255, 152, 0, 1)'
                    }, {
                      name: 'Criticism and Cynicism',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Criticism, Cynicism'] || null,
                      color: 'rgba(103, 58, 183, 1)'
                    }, {
                      name: 'Self-control and Practicality',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Self-Control, Practicality'] || null,
                      color:'rgba(0, 150, 136, 1)'
                    }, {
                      name: 'Leadership and Charisma',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Leadership, Charisma'] || null,
                      color: 'rgba(255, 152, 0, 0.75)'
                    }, {
                      name: 'Creative and Passion',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Creative, Passionate'] || null,
                      color: 'rgba(233, 30, 99, 0.75)'
                    }, {
                      name: 'Friendliness and Warm',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Friendly, Warm'] || null,
                      color: 'rgba(103, 58, 183, 0.75)'
                    }, {
                      name: 'Love and Happiness',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Love, Happiness'] || null,
                      color:'rgba(0, 150, 136, 0.75)'
                    }, {
                      name: 'Loneliness and Unfulfillment',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Loneliness, Unfulfillment'] || null,
                      color:'rgba(0, 150, 136, 0.4)'
                    }, {
                      name: 'Sadness and Sorrow',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Sadness, Sorrow'] || null,
                      color: 'rgba(255, 152, 0, 0.4)'
                    }, {
                      name: 'Defensiveness and Anxiety',
                      y: beyondVerbalAnalysisData.finalDataGroup11['Defensivness, Anxiety'] || null,
                      color: 'rgba(103, 58, 183, 0.4)'
                    }]
                  }]
                },
            })
          
          } else {
            //beyond verbal data is not defined
          }
              
        }
      }.bind(this))
  },

  handleClick: function(e) {
    this.setState({ isPrivate: e.target.checked }, function(){
      helpers.putPrivacy(this.state.isPrivate, this.state.videoId);

    });
  },

  verbalIcons: function() {
    return (
      <div className="verbal-icons">
        <i className="material-icons">thumb_down</i>
        <i className="material-icons">thumb_up</i>
        <i className="material-icons">thumbs_up_down</i>
      </div>
    )
  },

  render: function() {
    return (
      <div className="top-spacer">
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
          <Tabs onSelect={this.handleSelect} selectedIndex={0}>

            <TabList>
              <Tab>Video Emotion</Tab>
              <Tab>Voice Emotion</Tab>
              <Tab>Verbal Mood Groups</Tab>
              <Tab>Transcript & Pace</Tab>
              <Tab>Keyword Sentiment</Tab>
              <Tab>Comments</Tab>
            </TabList>

            <TabPanel>
              <div className="row col s12 card-panel explanations">
                  Analyze and understand facial expressions and engagement in your videos.
                  Your facial features and expressions are passed through an emotion recognition algorithm.
                  Every 250ms we will return values for things like "smile", "surprise", "negative" and "attention".
                  This helps you figure out how you may be perceived.
              </div>
              <Graph className="row col s12" data={this.state.kairosAnalysis}/>
            </TabPanel>

            <TabPanel>
              <div className="row card-panel explanations">
                <p className="col s12">The results of your voice analysis include:</p>
                <span className="col s1"><strong>Energy:</strong></span> <span className="col s11">measures degree of energy ranging from tranquil, bored or sleepy to excited and highly energetic.</span>
                <span className="col s1"><strong>Temper:</strong></span> <span className="col s11">reflects temperament or emotional state ranging from gloomy or depressive, embracive and friendly, to confrontational or aggressive.</span>
                <span className="col s1"><strong>Valence:</strong></span> <span className="col s11">measures level of attitude from negative to positive</span>
              </div>
              <Graph data={this.state.beyondVerbalAnalysis}/>
              <br/>
              <div className="row">
                <div className="col s4 center-align card-panel hoverable">
                    {(() => {
                      switch (this.state.atvArousal[0]) {
                        case "high":    return  <div className="verbal-icons"><i className="material-icons low atvSizes">battery_alert</i>
                                                    <i className="material-icons neutral atvSizes ">battery_full</i>
                                                    <i className="material-icons high atvSizes energy">battery_charging_full</i></div>;
                                        break;
                        case "medium":  return  <div className="verbal-icons"><i className="material-icons low atvSizes">battery_alert</i>
                                                    <i className="material-icons neutral atvSizes energy">battery_full</i>
                                                    <i className="material-icons high atvSizes">battery_charging_full</i></div>;
                                        break;
                        case "neutral": return  <div className="verbal-icons"><i className="material-icons low atvSizes">battery_alert</i>
                                                    <i className="material-icons neutral atvSizes energy">battery_full</i>
                                                    <i className="material-icons high atvSizes">battery_charging_full</i></div>;
                                        break;
                        case "low":     return  <div className="verbal-icons"><i className="material-icons low atvSizes energy">battery_alert</i>
                                                    <i className="material-icons neutral atvSizes ">battery_full</i>
                                                    <i className="material-icons high atvSizes">battery_charging_full</i></div>;
                                        break;

                      }
                    })()}
                  <p>
                  Your Energy was {this.state.atvArousal[0]}</p>
                  <hr/>
                  <p>{this.state.atvArousal[1]}</p>
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  {(() => {
                      switch (this.state.atvTemper[0]) {
                        case "high":    return  <div className="verbal-icons"><i className="material-icons low atvSizes">sentiment_dissatisfied</i>
                                                    <i className="material-icons neutral atvSizes ">sentiment_neutral</i>
                                                    <i className="material-icons high atvSizes temper">sentiment_satisfied</i></div>;
                                        break;
                        case "medium":  return  <div className="verbal-icons"><i className="material-icons low atvSizes">sentiment_dissatisfied</i>
                                                    <i className="material-icons neutral atvSizes temper">sentiment_neutral</i>
                                                    <i className="material-icons high atvSizes">sentiment_satisfied</i></div>;
                                        break;
                        case "neutral": return  <div className="verbal-icons"><i className="material-icons low atvSizes">sentiment_dissatisfied</i>
                                                    <i className="material-icons neutral atvSizes temper">sentiment_neutral</i>
                                                    <i className="material-icons high atvSizes">sentiment_satisfied</i></div>;
                                        break;
                        case "low":     return  <div className="verbal-icons"><i className="material-icons low atvSizes temper">sentiment_dissatisfied</i>
                                                    <i className="material-icons neutral atvSizes ">sentiment_neutral</i>
                                                    <i className="material-icons high atvSizes">sentiment_satisfied</i></div>;
                                        break;

                      }
                    })()}
                  <p>
                  Your Temper was {this.state.atvTemper[0]}</p>
                  <hr/>
                  <p>{this.state.atvTemper[1]}</p>
                </div>
                <div className="col s4 center-align card-panel hoverable">
                  {(() => {
                      switch (this.state.atvValence[0]) {
                        case "positive":    return  <div className="verbal-icons"><i className="material-icons low atvSizes">thumb_down</i>
                                                    <i className="material-icons neutral atvSizes ">thumbs_up_down</i>
                                                    <i className="material-icons high atvSizes valence">thumb_up</i></div>;
                                        break;
                        case "neutral": return  <div className="verbal-icons"><i className="material-icons low atvSizes">thumb_down</i>
                                                    <i className="material-icons neutral atvSizes valence">thumbs_up_down</i>
                                                    <i className="material-icons high atvSizes">thumb_up</i></div>;
                                        break;
                        case "negative":     return  <div className="verbal-icons"><i className="material-icons low atvSizes valence">thumb_down</i>
                                                    <i className="material-icons neutral atvSizes ">thumbs_up_down</i>
                                                    <i className="material-icons high atvSizes">thumb_up</i></div>;
                                        break;

                      }
                    })()}
                  <p>
                  Your Valence was {this.state.atvValence[0]}</p>
                  <hr/>
                  <p>{this.state.atvValence[1]}</p>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel explanations">
                Mood groups are an indicator of a speaker’s emotional state during the analyzed voice section.
                There are 432 combined emotions which are grouped into eleven main mood groups.
              </div>
              <h5>Emotions</h5>
              <div className=" row card-panel hoverable">
                <div >
                  <p className="col s6 center-align"><strong>Your Primary Emotions</strong></p>
                  <p className="col s6 center-align"><strong>Your Secondary Emotions</strong></p>
                </div>
                <div >
                  <br/>
                  <hr/>
                  <p className="col s6">{this.state.beyondVerbalDataCompPrimary}</p>
                  <p className="col s6">{this.state.beyondVerbalDataCompSecondary}</p>
                </div>
              </div>

              <hr/>
              <h5>Mood Groups</h5>
              <Graph data={this.state.moodGroup11Analysis}/>
              <div className="row">
                {this.state.moodComposites.map(function (item) {
                  return <div className="col s5 offset-s1 card-panel hoverable">
                      <br/>
                      <p className="center-align"><strong>{item[0]}</strong></p>
                    <hr/>
                    <p>{item[1]}</p>
                  </div>
                })}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel explanations">
                Here is the full transcript of your speech, courtesy of speech-to-text software,
                which is used to calculate your pace and word count.
              </div>
              <div className="card-panel hoverable">
              <h5>The Full Script</h5>
              {this.state.watsonFullScript}
              </div>
              <hr/>
              <div className="card-panel hoverable">
                <h5>Word Count & Pace</h5>
                <p>
                  The average American English speaker engaged in a friendly
                  conversation speaks at a rate of approximately 110–150 words per minute.
                </p>
                <p>
                  Your word count: <b>{this.state.wpmWatson[0]} words</b>
                  <br/>
                  Your pace: <b>{this.state.wpmWatson[1]} words per minute</b>
                </p>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row col s12 card-panel explanations">
                Sophisticated natural language processing techniques are used to analyze the content of your speech.
                Relevant keywords are extracted and analyzed for sentiment.
              </div>
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
              <div className="col 12">
                <CommentBox data={this.state.comments} author={this.state.author} videoId={this.state.videoId} />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
    )
  }
});

module.exports = Analysis;
