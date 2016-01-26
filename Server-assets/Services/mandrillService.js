var mandrill = require('mandrill-api/mandrill');
var moment = require('moment');
var async = require('async');
var MANDRILL_API_KEY;
console.log('ENV:',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
	console.log('inside if');
	MANDRILL_API_KEY = process.env.MANDRILL_API_KEY;
} else {
	var Secret = require('../../Server-assets/Secrets/secrets.js');
	MANDRILL_API_KEY = Secret.MANDRILL_API_KEY;
}

var mandrill_client = new mandrill.Mandrill(MANDRILL_API_KEY);


module.exports = {

emailVerify : function(user) {
  console.log("Mandrill", user);
  var message = {
    "html": "",
    "text": "Please verify your email address by clicking the following link http://localhost:9001/api/user/email/validation/" + user._id,
    "subject": "Sked Email Verification",
    "from_email": "info@sked.us",
    "from_name": "no_reply@sked",
    "to": [{
            "email": user.email,
            "name": user.name,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": user.email,
            "values": {
                "user_id": user._id
            }
        }],
    "send_at": user.createdAt
    };
  this.sendEmail(message);
},

welcomeEmail : function(user) {
  console.log("Mandrill Welcome", user);
  var message = {
    "html": "",
    "text": 'Welcome to the Sked family, you are now a part of a very special group of unicorns'+
     'or in our terms, "Skedicorns". We believe mentorship is one of the best ways for an'+
     'organization to reach out to and engage with their members, but as we have often seen,'+
      'many mentor programs suffer due to the stress of scheduling and managing everyone'+
       'involved. To shine a rainbow on that bureaucratic nightmare, Sked was created in the'+
      ' glittery depths of Mount Uni from the kernels of a corn, so if you were thinking about'+
       'some horse like creature earlier on then you were wrong and everything you stand for is'+
        'wrong. (Pay no attention to our logo, that\'s\ just one guy with another guy on his back'+
         'holding a large corn kernel up into the air). But I digress, welcome to Sked you '+
         'filthy stinking animal!   ',
    "subject": "Welcome to Sked!",
    "from_email": "info@sked.us",
    "from_name": "The Skedicorns",
    "to": [{
            "email": user.email,
            "name": user.name,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": user.email,
            "values": {
                "user_id": user._id
            }
        }],
    "send_at": user.createdAt
    };
  this.sendEmail(message);
},

forgotPass : function(req, token, user) {
  console.log("Sending forgot Password email", req.headers, token, user);
  var message = { "html": "",
    "text": 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    "subject": "Sked Email Verification",
    "from_email": "info@sked.us",
    "from_name": "no_reply@sked",
    "to": [{
            "email": user.email,
            "name": user.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": user.email,
            "values": {
                "user_id": user._id
            }
        }],
    "send_at" : user.updatedAt,

    };
    this.sendEmail(message);
},

passChangeConfirm : function(user) {
  console.log("sending password reset email", user);
  var message = { "html": "",
    "text": 'Hello,\n\n' +
      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
    "subject": "Sked Email Verification",
    "from_email": "info@sked.us",
    "from_name": "no_reply@sked",
    "to": [{
            "email": user.email,
            "name": user.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": user.email,
            "values": {
                "user_id": user._id
            }
        }],
    "send_at": user.updatedAt,
  };
  this.sendEmail(message);
},

apptConfirmMentee : function(appt, user, mentor) {
  var message = {
    "html": "",
    "text": "Hello " + user.firstName + ", your meeting with " + mentor.firstName + " " + mentor.lastName + " has been booked for " + appt.startsAt + " please arrive at " + appt.loc + " at least 10 minutes before the scheduled time.",
    "subject": "Sked Meeting Booked",
    "from_email": "info@sked.us",
    "from_name": "Sked Meetings",
    "to": [{
            "email": user.email,
            "name": user.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": user.email,
            "values": {
                "user_id": user._id
            }
        }],
    "send_at": user.createdAt
    };
  this.sendEmail(message);
},

apptConfirmMentor : function(appt, user, mentor) {
  var message = {
    "html": "",
    "text": "Hello " + mentor.firstName + ", your meeting with " + user.firstName + " " + user.lastName + " has been booked for " + appt.startsAt + " please arrive at " + appt.loc + " at least 10 minutes before the scheduled time.",
    "subject": "Sked Meeting Booked",
    "from_email": "info@sked.us",
    "from_name": "Sked Meetings",
    "to": [{
            "email": mentor.email,
            "name": mentor.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": mentor.email,
            "values": {
                "user_id": mentor._id
            }
        }],
    "send_at": user.createdAt
    };

  this.sendEmail(message);
},

apptCancelMentee : function(appt, mentee, mentor) {
  console.log("No not there, it's here");
  var message = {
    "html": "",
    "text": "Hello " + mentee.firstName + ", your meeting with " + mentor.firstName + " " + mentor.lastName + " for " + appt.startsAt + " has been cancelled.",
    "subject": "Sked Meeting Booked",
    "from_email": "info@sked.us",
    "from_name": "Sked Meetings",
    "to": [{
            "email": mentee.email,
            "name": mentee.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": mentee.email,
            "values": {
                "user_id": mentee._id
            }
        }],

    "send_at": null
    };
  this.sendEmail(message);
},

apptCancelMentor : function(appt, mentee, mentor) {
  console.log("here Man");
  var message = {
    "html": "",
    "text": "Hello " + mentor.firstName + ", your meeting with " + mentee.firstName + " " + mentee.lastName + " scheduled for " + appt.startsAt + " has been cancelled. ",
    "subject": "Sked Meeting Cancelled",
    "from_email": "info@sked.us",
    "from_name": "Sked Meetings ",
    "to": [{
            "email": mentor.email,
            "name": mentor.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": mentor.email,
            "values": {
                "user_id": mentor._id
            }
        }],
    "send_at": null
    };
  this.sendEmail(message);
},

apptRemindMentee : function(appt, user, mentee) {
  var message = {
    "html": "",
    "text": "Hello " + mentee.firstName + ", your meeting with " + user.firstName + " " + user.lastName + " has been booked for " + appt.startsAt + " please arrive at " + appt.loc + " at least 10 minutes before the scheduled time.",
    "subject": "Sked Meeting Booked",
    "from_email": "info@sked.us",
    "from_name": "Sked Meetings",
    "to": [{
            "email": mentee.email,
            "name": mentee.firstName,
            "type": "to"
        }],
    "important": true,
    "auto_text": true,
    "auto_html": true,
    "recipient_metadata": [{
            "rcpt": mentee.email,
            "values": {
                "user_id": mentee._id
            }
        }],
    "async" : false,
    "send_at": user.createdAt
    };
    var flag = false;
  this.sendEmail(message);
},

sendEmail : function(message) {
    mandrill_client.messages.send({"message": message, "async": async}, function(result) {
      console.log(result);
    }, function(e) {
      console.log('A mandrill error occurred' + e.name + ' - ' + e.message);
    });
  },

};
