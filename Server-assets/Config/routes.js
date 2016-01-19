var userServCtrl = require('../Controllers/userServCtrl.js');
var User = require('../Models/userSchema.js');

module.exports = function(app, passport) {

	//route middleware
	var requireAuth = function(req, res, next) {
		if (!req.isAuthenticated()) {
			return res.status(401).end();
		}
		console.log("requireAuth done")

		next();
	};

	//LINKEDIN ROUTES //////////////////////////////////////

	app.get('/api/auth/linkedin',
		passport.authenticate('linkedin'),
		function(req, res) {
			app.post('/api/users', req.user);
			console.log("posted new linkedin user : ", req.user);
	})

	app.get('/api/auth/linkedin/callback',
		passport.authenticate('linkedin', {failureRedirect: '/#/login' }),
		function(req,res) {
			res.redirect('/#/home');
	});


	//LOCAL-AUTH ROUTES ///////////////////////////////////

	//registration
	app.post('/api/users', userServCtrl.addUser);

	//login
	app.post('/api/auth/local', passport.authenticate('local'), requireAuth, function(req, res) {
		res.status(200).end();
	});

	//logout
	app.get('/api/auth/logout', function(req, res) {
		console.log("api/auth/logout");
		req.logout();
		return res.status(200).end();
	});

	//USER ROUTES/////////////////////////////////////////////

	//get users
	app.get('/api/users', requireAuth, function(req, res) {
		User.find().exec().then(function(res) {
			if (!res) {
				return res.status(404).end();
			} else {
				console.log(res);
				return res.json(res);
			}
			// return res.status(200).end();
		})
	})

	app.get('/api/user/:id', function(req, res) {
		User.findOne({ _id : req.params.id }).exec().then(function(res) {
			console.log(res);
			return res.json(res).end();
		})
	})

	//update user
	app.put('/api/users/:id', function(req, res) {
		User.update({ _id: req.params.id}, req.body).exec().then(function(res) {
			console.log(res);
			return res.status(200).end();
		})
	})


	//CHECK LOGGED IN USER //////////////////////////////////

	app.get('/api/users/currentuser', requireAuth, function(req, res) {
		// console.log("req.user", req.user);
		return res.json(req.user);
	});


	//ADDING LINKEDIN ////////////////////////////////////////

  // send to facebook to do the authentication
  app.get('/connect/linkedin', passport.authorize('linkedin', { scope : 'email' }));

  // handle the callback after linkedin has authorized the user
  app.get('/connect/linkedin/callback',
      passport.authorize('linkedin', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));
	

}