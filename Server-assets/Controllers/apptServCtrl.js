var mongoose = require('mongoose');
var Appt = require('../Models/apptSchema');
var User = require('../Models/userSchema');
var Org = require('../Models/orgSchema');
// var mandrillService = require('../Services/mandrillService');
var clearAppts = require('../Cron/clearAppts.js');


module.exports = {


  //  api/apt/:orgID/:userID // POST
  createAppt: function(req, res) {
    Org.findById(req.params.orgID).then(function(org){
      var apt = new Appt(req.body);
        apt.save();
        console.log("newAptID:", apt._id)
        org.apts.push(apt._id);
        org.save(function(){
          res.status(200).end();
        })
    })
  },

  //  api/apt/:orgID/:userID // PUT
  addApptToOrg: function(req, res){
    Org.findOne({_id: req.params.orgID}).exec().then(function(org){
      org.apts.push(req.body);
      return org.save().then(function(results){
        return res.json(results);
      })
    })
  },

// api/apt/:orgID/:userID/open // GET
  getMyOpenAppts: function(req, res){
    Appt.find({mentor: req.params.userID}).find({org: req.params.orgID}).find({status: "open"}).sort({startsAt: 1}).exec().then(function(results){
      res.json(results);
    })
  },

// api/apt/all/:userID/booked // GET  //for all booked appointments per user
  getMyMentorBookedAppts: function(req, res){
    Appt.find( {$or: [{mentor: req.params.userID}, {mentee: req.params.userID}]})
    .find({status: "booked"})
    .sort({startsAt: 1})
    .populate("org")
    .populate("mentor")
    .populate("mentee")
    .exec().then(function(results){
      res.json(results);
    });
  },

  // api/apt/:userID/booked // GET
  getMyMenteeBookedAppts: function(req, res){
    Appt.find({mentee: req.params.userID}).sort({startsAt: 1}).populate("org").populate("mentor").exec().then(function(results){
      res.json(results);
    });
  },

// api/apt/:orgID // GET
  getOrgAppts: function(req, res){
    Appt.find({org: req.params.orgID}).sort({startsAt: 1}).populate("mentor").exec().then(function(results){
      res.json(results);
    });
  },

// api/apt/:aptID // PUT
  skedApt: function(req, res){
    Appt.findById({_id: req.params.aptID}).exec().then(function(appt){
      appt.mentee = req.body.mentee;
      appt.status = req.body.status;
      appt.save().then(function() {
        User.findById({_id: appt.mentor}).exec().then(function(mentor) {
          // mandrillService.apptConfirmMentee(appt, req.user, mentor);
          // mandrillService.apptConfirmMentor(appt, req.user, mentor);
          res.status(200).end();
        });
      });
    });
  },

// api/apt/cancel/:aptID // PATCH
  aptCancel: function(req, res){
    console.log("got to server");
    console.log("aptID: ", req.params.aptID);
    Appt.findById({_id: req.params.aptID}).then(function(appt){
        User.findById({_id: appt.mentor}).exec().then(function(mentor) {
          User.findById({_id: appt.mentee}).exec().then(function(mentee) {
            // mandrillService.apptCancelMentee(appt, mentee, mentor);
            // mandrillService.apptCancelMentor(appt, mentee, mentor);
            appt.status = req.body.status;
            appt.mentee = req.body.mentee;
            console.log("appt:", appt)
            appt.save(function(){
              res.status(201).end();
            });
          });
        });
    });
  },

  // api/apt/delete/:aptID/:orgID // PUT
  aptDelete: function(req, res){
    Org.findById({_id: req.params.orgID}).exec().then(function(org){
        var apts = org.apts;
        for(var i = 0; i < apts.length; i++){
          if(apts[i] === req.params.aptID){
            apts.splice(i, 1);
            break;
          }
        }
        org.save();
        Appt.remove({ _id : req.params.aptID }).exec();
          return res.status(204).end();
    })
  },











  //call all appts in organization TEST DO
  getAppts: function(req, res) {
    //need to update call for specific dates ///////////////////////////////////////////////////////////////////
    Org.findOne({ _id : req.params.orgID }).populate("host").exec().then(function(results) {
      console.log("appts from org: ", results.appts);

      return res.json(results.appts);
    }).then(null, function(err) {
      return res.status(500).json(err);
    });
  },

  //call a specific appt TEST DONE
  getAppt: function(req, res) {

    Appt.findOne({_id: req.params.apptID}).exec().then(function(results) {
      if(results) {
        console.log("appt : ", results);
        return res.json(results);
      }
      else {
        res.status(404).end();
      }
    })
  },

  //delete appointment, not the same as cancelling TEST DONE
  deleteAppt: function(req,res) {
    console.log("DELETE PROCESS START");


    Appt.findOne({ _id : req.params.apptID }).exec().then(function(results) {

      var currentAppt = results;
      // console.log("appt found : ", currentAppt);

      Org.findOne({ _id : currentAppt.org }).exec().then(function(results) {


        var currentOrg = results;
        // console.log("ORG BEFORE : ", currentOrg);
        var orgIndex = currentOrg.appts.indexOf(req.params.apptID);
        currentOrg.appts.splice(orgIndex, 1);
        // console.log("ORG AFTER : ", currentOrg);
        currentOrg.save();

        User.findOne({ _id : currentAppt.host }).exec().then(function(results) {

          var currentHost = results;
          // console.log("HOST BEFORE: ", currentHost);
          var hostIndex = currentHost.host.indexOf(req.params.apptID);
          currentHost.host.splice(hostIndex, 1);
          // console.log("HOST AFTER : ", currentHost);
          currentHost.save();


          for (var i = 0; i < currentAppt.attendees; i++) {

            User.findOne({ _id : currentAppt.attendees[i] }).exec().then(function(results) {

              var currentUser = results;
              // console.log("USER BEFORE : ", currentUser);
              var userIndex = currentUser.appts.indexOf(req.params.apptId);
              currentUser.appts.splice(userIndex, 1);
              // console.log("USER AFTER : ", currentUser);
              currentUser.save();

            })

          }


          Appt.remove({ _id : req.params.apptID }).exec();

          console.log("app deleted");
          return res.status(204).end()

        })

      })

    })

  },

  //add an attendee to an appointment TEST DONE
  addAttendee : function(req, res) {

    var currentAppt = req.params.apptID;
    var currentUser = req.user._id;
    // var currentUser = "5696bfa5ac8f7eeb0aba1a10"; /////////////////////////////////////////////////////


    Appt.findOne({ _id : currentAppt }).exec().then(function(results) {

      var attendeesArray = results.attendees;
      // console.log("adding attendee.  BEFORE : ", attendeesArray);
      attendeesArray.push(currentUser);
      // console.log("adding attendee.  AFTER : ", attendeesArray);

      Appt.update({ _id : currentAppt }, { attendees : attendeesArray }, { status : 'booked' }).exec();


      User.findOne({ _id : currentUser }).exec().then(function(results) {

        // console.log("adding appointment. USER BEFORE : ", results);

        var apptArray = results.appts;
        apptArray.push(currentAppt);

        User.update({ _id : currentUser }, { appts : apptArray }).exec();

      })

      return res.status(204).end();

    })

  },

  //remove an attendee from an appointment, ONLY from attendees POV, TEST DONE
  deleteAttendee : function(req, res) {

    var currentAppt = req.params.apptID;
    var currentUser = req.user._id;
    // var currentUser = "5696bfa5ac8f7eeb0aba1a10"; /////////////////////////////////////////////////////

    Appt.findOne({ _id : currentAppt }).exec().then(function(results) {

      var appt = results;
      // console.log("deleteAttendee. APPT BEFORE : ", appt);

      var index = appt.attendees.indexOf(currentUser);
      appt.attendees.splice(index, 1);
      if(appt.attendees.length === 0) {
        appt.status = 'open';
      }
      // console.log("delete Attendee. APPT AFTER : ", appt);

      Appt.update({ _id : currentAppt }, appt).exec();

      User.findOne({ _id: currentUser }).exec().then(function(results) {

        var user = results
        // console.log("deleteAttendee. USER BEFORE : ", user);

        index = user.appts.indexOf(currentAppt);
        user.appts.splice(index, 1);

        // console.log("delete Attendee. USER AFTER : ", user);

        User.update({ _id : currentUser }, user).exec();

      })

      console.log("attendee deleted from appointment");
      return res.status(200).end();

    })

  },

  //update appt: location and update sections of schema, cancelling TEST DONE
  updateAppt : function(req,res) {

    var currentAppt = req.params.apptID;

    Appt.update({ _id: currentAppt }, req.body).exec().then(function(result) {
      console.log("app updated : ", result);
      return res.status(200).end();
    })

  },


};
