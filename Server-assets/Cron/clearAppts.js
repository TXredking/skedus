var Org = require('../Models/orgSchema.js'),
	User = require('../Models/userSchema.js'),
	Appt = require('../Models/apptSchema.js');

//searches at midnight
module.exports = {
	changeStatus : function() {
				console.log('appointment loggin1');	
		// Appt.find({ status : 'open' }).exec().then(function(result) {
		Appt.find({ startsAt : { $lt: Date.now() }, status : 'open' }).exec().then(function(result) {
				console.log('appointment results : ', result);
			
			for (var i = 0; i < result.length; i++) {
				
				if (result[i].status === 'open') {
					console.log("result[i], ", result[i].status);
					result[i].status = 'past';
					console.log("result[i], ", result[i].status);
				}

				result[i].save();
			}

		});

		Appt.find({ endsAt : { $lt: Date.now() }, status : 'booked' }).exec().then(function(result) {
			
			for (var k = 0; k < result.length; k++) {
				
				if (result[k].status === 'booked') {
					result[k].status = 'completed';
				}

				result[k].save();
			}

		});
	}

}



