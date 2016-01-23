var Org = require('../Models/orgSchema.js'),
	User = require('../Models/userSchema.js'),
	Appt = require('../Models/userSchema.js');

//searches at midnight
Appt.find({ endsAt : { $lt: Date.now() }, status : 'open' }).exec().then(function(result) {
	
	for (var i = 0; i < result.length; i++) {
		
		if (result[i].status === 'open') {
			result[i].status = 'past';
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



