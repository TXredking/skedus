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
		req.flash('error', 'flash message');
		res.status(200).end();
	});

	//logout
	app.get('/api/auth/logout', function(req, res) {
		console.log("api/auth/logout");
		req.logout();
		req.session.destroy();
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

  //FORGOT PASSWORD//////////////////////////////////////////

 //  app.post('/forgot', function(req, res, next) {
	//   async.waterfall([
	//     function(done) {
	//       crypto.randomBytes(20, function(err, buf) {
	//         var token = buf.toString('hex');
	//         done(err, token);
	//       });
	//     },
	//     function(token, done) {
	//       User.findOne({ email: req.body.email }, function(err, user) {
	//         if (!user) {
	//           req.flash('error', 'No account with that email address exists.');
	//           return res.redirect('/forgot');
	//         }

	//         user.resetPasswordToken = token;
	//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	//         user.save().then(function() {
	// 	        console.log("sending forgot email");
	// 	          var message = { "html": "",
	// 	            "text": 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	// 		          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	// 		          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	// 		          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	// 	            "subject": "Sked Email Verification",
	// 	            "from_email": "info@sked.us",
	// 	            "from_name": "no_reply@sked",
	// 	            "to": [{
	// 	                    "email": user.email,
	// 	                    "name": user.name,
	// 	                    "type": "to"
	// 	                }],
	// 	            "important": true,
	// 	            "auto_html": true,
	// 	            "recipient_metadata": [{
	// 	                    "rcpt": user.email,
	// 	                    "values": {
	// 	                        "user_id": user._id
	// 	                    }
	// 	                }],

	// 	        };
	// 	        mandrill_client.messages.send({"message": message, "async": async, "send_at": user.createdAt}, function(result) {
	// 	          console.log(result);
	// 	        }, function(e) {
	// 	          console.log('A mandrill error occurred' + e.name + ' - ' + e.message);
	// 	        });
	// 	        return res.status(201).end();
	// 	      });

	//     //     user.save(function(err) {
	//     //       done(err, token, user);
	//     //     });
	//     //   });
	//     // },
	//     // function(token, user, done) {
	//     //   var smtpTransport = nodemailer.createTransport('SMTP', {
	//     //     service: 'SendGrid',
	//     //     auth: {
	//     //       user: '!!! YOUR SENDGRID USERNAME !!!',
	//     //       pass: '!!! YOUR SENDGRID PASSWORD !!!'
	//     //     }
	//     //   });
	//     //   var mailOptions = {
	//     //     to: user.email,
	//     //     from: 'passwordreset@demo.com',
	//     //     subject: 'Node.js Password Reset',
	//     //     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	//     //       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	//     //       'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	//     //       'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	//     //   };
	//     //   smtpTransport.sendMail(mailOptions, function(err) {
	//     //     req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
	//     //     done(err, 'done');
	//     //   });
	//     // }
	//   ], function(err) {
	//     if (err) return next(err);
	//     res.redirect('/forgot');
	//   });
	// });
	

}
