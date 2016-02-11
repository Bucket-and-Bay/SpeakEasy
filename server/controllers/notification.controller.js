var client = require('twilio')('AC3bef12c44235587fcb05665ac1793246', '09a738a65dd50bd98a6da2699de7080d');
var mongoose = require ('mongoose');
var User = require ('../models/user.model.js');
var apiKeys = require('../config.js');

var nodemailer = require('nodemailer').createTransport({
    service:'gmail',
    auth:{
        user: apiKeys.email,
        pass: apiKeys.password
    }
});

//Send an SMS text message
module.exports.byText = function(user){
    console.log('intexting function')
    User.findOne({username:user})
    .then(function(data){
        // if(data.phoneNumber){
        //     console.log(data, 'user should be here');
        //     client.sendMessage({
        //         to:'+1'+data.phoneNumber, // Any number Twilio can deliver to
        //         from: '+14234020972', // A number you bought from Twilio and can use for outbound communication
        //         body: 'Hi! Its your friends at SpeakEasy. Your video analysis is now ready.' // body of the SMS message

        //     }, function(err, responseData) { //this function is executed when a response is received from Twilio
        //         if(err){
        //             console.log(err, 'error?')
        //         }
        //         if (!err) {
                    
        //             console.log(responseData.from); 
        //             console.log(responseData.body); 

        //         }
        //     });
        // } 
        if(data.email){
            console.log('email')
            console.log(data.email)
            var mailOptions = {
                from:'Bucket and Bay <bucketandbay@gmail.com>',
                to: data.email,
                subject: 'Your analysis is ready.',
                html: '<h5>Your video analysis is waiting. Check your SpeakEasy dashboard to find out how you did.</h5>  \n <i>Your friends at Bucket and Bay</i>'
            }

            nodemailer.sendMail (mailOptions,function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
        }
    });
};