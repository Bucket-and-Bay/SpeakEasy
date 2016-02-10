var client = require('twilio')('AC3bef12c44235587fcb05665ac1793246', '09a738a65dd50bd98a6da2699de7080d');
var mongoose = require ('mongoose');
var User = require ('../models/user.model.js');
var nodemailer = require('nodemailer').createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

//Send an SMS text message
module.exports.byText = function(user){
    User.findOne({username:user}).
    then(function(user){
        if(user.phoneNumber){
            client.sendMessage({
                to:'+1'+user.phoneNumber, // Any number Twilio can deliver to
                from: '+14234020972', // A number you bought from Twilio and can use for outbound communication
                body: 'Hi! Its your friends at SpeakEasy. Your video analysis is now ready.' // body of the SMS message

            }, function(err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) {
                    
                    console.log(responseData.from); 
                    console.log(responseData.body); 

                }
            });
        }else if(user.email){
            var mailOptions = {
                from:'Bucket and Bay <bucketandbay@gmail.com>',
                to: user.email,
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