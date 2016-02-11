var React = require('react');
var helpers = require('../config/helper.js');
var Modal = require('react-modal');

var customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var VideoInput = React.createClass({
  getInitialState: function () {
    return {modalIsOpen: false};
  },

  componentDidMount: function() {
    window.analytics.page('Upload Video');
  },
  
  handleSubmit: function(e) {
    this.openModal();
    e.preventDefault();
    if(this.checkForm()){
      var video = this.refs.video.files[0];
      var title = this.refs.title.value;
      var description = this.refs.description.value;
      var validVideoFormats = {
        'video/mp4': true,
        'video/quicktime': true,
        'video/avi': true
      };
      if (validVideoFormats[video.type]){

        helpers.submitVideo(video)
          .then(function(shortcode){
            var data = {
              shortcode: shortcode,
              description: description,
              title: title
            }
            helpers.sendCode(data)
            .then(function(response){
              setTimeout(function(){this.closeModal();}, 100000);
              this.refs.line.value = '';
              this.refs.video.value = '';
              this.refs.title.value = '';
              this.refs.description.value = '';
              console.log('submitted video for analysis');
            }.bind(this));
          }.bind(this))   
      } else {
        alert("This is an invalid video format. Please upload .mp4, .mov, or .avi only.");
      }
    } else {
      console.log('choose a file');
    }
  },
  handleFile: function() {
    this.refs.line.value = this.refs.video.files[0].name;
  },
  checkForm: function(){
    if(this.refs.video.files.length > 0 && this.refs.title.value.length > 0 && this.refs.description.value.length > 0 ){
      return true;
    } else {
      alert('Title and Description is required')
      return false;
    }
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },
 
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render: function() {
    return (
      <div className="top-spacer">
      <div>
          <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles} >
            <div id="modal-background" className="container">
              <div className="col s12 m4">
                    <div className="icon-block">
                      <h2 className="center teal-text"><i className="material-icons">group</i>Tips</h2>
                      <h5 className="center">Thanks for submitting. We'll let you know your analysis is ready. In the meantime, here's a tip to help you improve.</h5>
                    </div>
                  </div>
            </div>
          </Modal>
        </div>
        <div className="container">
          <div className="card-panel">
            <div className="row">
                <form onSubmit={this.handleSubmit} className="col s12">
                  <h5>Video Submission</h5>
                  <h6>We will send you an email when its done!</h6>
                  <br/>
                  <div className="file-field input-field">  
                    <div className="btn">
                    <span>File</span>
                      <input type="file" ref='video' onChange={this.handleFile} />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" ref="line"type="text" />
                    </div>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">view_headline</i>
                    <input ref="title"type="text" className="validate" placeholder="Video Title"/>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">description</i>
                    <input ref="description"type="text" className="validate" placeholder="Description"/>
                  </div>
                  <div className="text-center"> 
                    <button type="button" type="submit" href="#modal" id="fallback" className="btn waves-effect waves-light">Submit</button>
                  </div>
                </form>
            </div>
          </div>
          <div className="row col s12 card-panel explanations">
            For optimal analysis results, please follow these video upload guidelines:
            <ol>
              <li>Please speak clearly into the microphone. Audio quality improves with a headset or dedicated microphone.</li>
              <li>Decrease background noise by recording in a moderately quiet room.</li>
              <li>Record a single speaker only. More than one speaker may provide unreliable results.</li>
              <li>For best results, take off glasses, hats, or anything covering your face or forehead.</li>
              <li>While speaking, please face towards the camera.</li>
              <li>Verbal analysis results require at least 13 seconds of speaking.</li>
              <li>Please limit videos to less than 60 seconds.</li>
              <li>Valid video format types include: .mp4, .mov, and .avi</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
});
 

module.exports = VideoInput;


