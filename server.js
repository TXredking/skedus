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
    session = require('express-session'),
    async = require('async'),
    crypto = require('crypto'),
    mongoUri = require('./Server-assets/Config/database.js');

    var SESSION_SECRET;

    if (process.env.NODE_ENV === 'production') {
      SESSION_SECRET= process.env.SESSION_SECRET;
    } else {
      SESSION_SECRET = require('./Server-assets/Secrets/secrets.js').SESSION_SECRET;
    }

    app.use(cors(), bodyParser.json(), express.static(__dirname + '/Public'));





// required for passport
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//configure passport
require('./Server-assets/Config/passport.js')(passport, app);

//endpoints/routes
require('./Server-assets/Config/routes.js')(app, passport);


var requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).end();
    }
    console.log("requireAuth done")

    next();
};

    //User Requests
    // app.get('/api/users/rando', userServCtrl.randomUser);
    app.post('/api/users', userServCtrl.addUser);
    app.get('/api/users', userServCtrl.getUsers);
    app.get('/api/user/:id', userServCtrl.getUser);
    app.put('/api/user/:id', userServCtrl.updateUser); //Includes archiveUser
    app.get('/api/user/:id/orgs', requireAuth, userServCtrl.getUserOrgs);
    app.get('/api/user/:id/org/:orgID', userServCtrl.getUserOrg);
    app.get('/api/user/:id/org/:orgID/role', userServCtrl.getUserRole);
    // app.put('/api/org/join/:orgID', orgServCtrl.updateOrgWithUser);

    // //Org Request
    app.post('/api/orgs/:userID', orgServCtrl.addOrg);
    app.get('/api/orgs', orgServCtrl.getOrgs);
    app.get('/api/org/:orgID', orgServCtrl.getOrg);
    app.put('/api/org/:orgID', orgServCtrl.updateOrg);
    app.get('/api/org/:orgID/users', orgServCtrl.getOrgUsers);
    app.post('/api/org/:orgID/users', orgServCtrl.addOrgUser);
    app.put('/api/org/:orgID/users', orgServCtrl.removeOrgUser);
    app.post('/api/org/:orgID/mentors', orgServCtrl.changeOrgRole);
    app.post('/api/org/:orgID/admins', orgServCtrl.changeOrgRole);
    app.post('/api/org/:orgID/user', orgServCtrl.changeOrgRole);


    // app.put('/api/org/:orgID', orgServCtrl.addAppt);  //Includes archiveOrg

    //appt
    app.post('/api/apt/:orgID/:userID', apptServCtrl.createAppt);
    app.put('/api/apt/:orgID/:userID', apptServCtrl.addApptToOrg);
    app.get('/api/apt/:orgID/:userID/open', apptServCtrl.getMyOpenAppts);
    app.get('/api/apt/:orgID/mentor/:userID/booked', apptServCtrl.getMyMentorBookedAppts);
    app.get('/api/apt/:userID/booked', apptServCtrl.getMyMenteeBookedAppts);
    app.get('/api/apt/:orgID', apptServCtrl.getOrgAppts);
    app.put('/api/apt/:aptID', apptServCtrl.skedApt);
    app.patch('/api/apt/cancel/:aptID', apptServCtrl.aptCancel);
    app.put('/api/apt/delete/:aptID/:orgID', apptServCtrl.aptDelete);




    app.post('/api/org/:orgID/appts', apptServCtrl.createAppt);
    app.get('/api/org/:orgID/appts', apptServCtrl.getAppts);
    app.get('/api/appt/:apptID', apptServCtrl.getAppt);
    app.delete('/api/appt/:apptID', apptServCtrl.deleteAppt);
    app.put('/api/appt/:apptID/mentee', apptServCtrl.addAttendee);
    app.delete('/api/appt/:apptID/mentee', apptServCtrl.deleteAttendee);
    app.put('/api/appt/:apptID/mentor/', apptServCtrl.updateAppt); //changes for update and location section in schema, cancelling


    //Mandrill Email Verification endpoint
    app.get('/api/user/email/validation/:userID', userServCtrl.validateEmail);


app.listen(port, function() {
    console.log("Listening on port ", port);
});

mongoose.connect(process.env.MONGOLAB_URI || mongoUri.url);
mongoose.connection.once('connected', function() {
  console.log('db connected');
});
