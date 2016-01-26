var User = require('../Models/userSchema.js'),
	Appt = require('../Models/apptSchema.js'),
	mandrillService = require('../Services/mandrillService');



//sends at midnight
var myDate = new Date();

//add a day to the date
myDate.setDate(myDate.getDate() + 1);

		Appt.find({ startsAt : { $lt : myDate }, status : 'booked' }).exec().then(function(results) {
			console.log("reminder loggin2");

				for (var i = 0; i < results.length; i++) {
					User.find({ _id : results[i].mentees}).exec().then(function(mentees) {
						for (var k = 0; k < mentees.length; k++) {
							mandrillService.apptRemindMentee(results[i], results[i].host, mentees[k]);
						}
					})
				}

			})