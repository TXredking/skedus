var express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    userServCtrl = require('./Server-assets/Controllers/userServCtrl.js'),
    orgServCtrl = require('./Server-assets/Controllers/orgServCtrl.js'),
    apptServCtrl = require('./Server-assets/Controllers/apptServCtrl.js'),
    mongoose = require('mongoose'),
  	passport = require('passport'),
  	port = process.env.PORT || 9001,
  	bodyParser = require('body-parser'),
  	session = require('express-session'),
    mongoUri = require('./Server-assets/Config/database.js'),
  	Secret = require('./Server-assets/Secrets/secrets.js');

    app.use(cors(), bodyParser.json(), express.static(__dirname + '/Public'));

    //User Requests
    app.post('/api/users', userServCtrl.addUser);
    app.get('/api/users', userServCtrl.getUsers);
    app.get('/api/user/:id', userServCtrl.getUser);
    // app.get('/api/user/:id/orgs', orgServCtrl.getOrgbyUserId);
    // app.get('/api/user/:id/orgs', orgServCtrl.getUserOrgs);
    // app.get('/api/user/:id/orgs', userServCtrl.getOrgs);
    app.put('/api/user/:id', userServCtrl.updateUser); //Includes archiveUser
    app.get('/api/user/:id/orgs', userServCtrl.getUserOrgs);
    app.get('/api/user/:id/org/:orgID', userServCtrl.getUserOrg);
    app.get('/api/user/:id/org/:orgID/role', userServCtrl.getUserRole);
    // app.put('/api/org/join/:orgID', orgServCtrl.updateOrgWithUser);

    // //Org Request
    app.post('/api/orgs/:userID', orgServCtrl.addOrg);
    app.get('/api/orgs', orgServCtrl.getOrgs);
    app.get('/api/org/:orgID', orgServCtrl.getOrg);
    app.put('/api/org/:orgID', orgServCtrl.updateOrg);
    // app.post('/api/org/:orgID/admins', orgServCtrl.addAdmin); //Needs to be updated for new UserSchema
    // app.put('/api/org/:orgID', orgServCtrl.addMentor);
    app.get('/api/org/:orgID/users', orgServCtrl.getOrgUsers);
    app.post('/api/org/:orgID/users', orgServCtrl.addOrgUser);
    app.put('/api/org/:orgID/users', orgServCtrl.removeOrgUser);
    // app.put('/api/org/:orgID', orgServCtrl.addAppt);  //Includes archiveOrg

    //appt
    app.post('/api/apt/:orgID/:userID', apptServCtrl.createAppt);
    app.put('/api/apt/:orgID/:userID', apptServCtrl.addApptToOrg);
    app.get('/api/apt/:orgID/:userID/open', apptServCtrl.getMyOpenAppts);
    app.get('/api/apt/:orgID/mentor/:userID/booked', apptServCtrl.getMyMentorBookedAppts);
    app.get('/api/apt/:userID/booked', apptServCtrl.getMyMenteeBookedAppts);
    app.get('/api/apt/:orgID/open', apptServCtrl.getOrgOpenAppts);
    app.put('/api/apt/:aptID', apptServCtrl.skedApt);
    app.patch('/api/apt/cancel/:aptID', apptServCtrl.aptCancel);




    app.get('/api/org/:orgID/appts', apptServCtrl.getAppts);
    app.get('/api/appt/:apptID', apptServCtrl.getAppt);
    app.delete('/api/appt/:apptID', apptServCtrl.deleteAppt);
    app.put('/api/appt/:apptID/mentee', apptServCtrl.addAttendee);
    app.delete('/api/appt/:apptID/mentee', apptServCtrl.deleteAttendee);
    app.put('/api/appt/:apptID/mentor/', apptServCtrl.updateAppt); //changes for update and location section in schema, cancelling



// required for passport
app.use(session({
	secret: Secret.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//configure passport
require('./Server-assets/Config/passport.js')(passport);

//endpoints/routes
require('./Server-assets/Config/routes.js')(app, passport);

app.listen(port, function() {
	console.log("Listening on port ", port);
});

mongoose.connect(process.env.MONGOLAB_URI || mongoUri.url);
mongoose.connection.once('connected', function() {
  console.log('db connected');
});
