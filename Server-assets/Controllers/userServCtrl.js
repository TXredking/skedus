var mongoose = require('mongoose');
var Org = require('../Models/orgSchema');
var User = require('../Models/userSchema');
var faker = require('faker');
var mandrillService = require('../Services/mandrillService');
var rando;

module.exports = {

  // randomUser: function(req, res) {
  //   rando = faker.helpers.userCard();
  //   randomNum = function() {
  //     return Math.floor(Math.random() * (99 - 1)) + 1;
  //   };
  //   var firstName = function() {
  //     var space = rando.name.indexOf(" ");
  //     if  (rando.name.indexOf(".") < 0) {
  //       return rando.name.slice(0, space);
  //     }
  //     else {
  //       var cutOff = rando.name.indexOf(".") + 2;
  //       return rando.name.slice(cutOff, space);
  //     }
  //   };
  //   console.log(firstName);
  //   rando.firstName = firstName();
  //   rando.email = rando.firstName.toLowerCase() + rando.email.slice(rando.email.indexOf('@'));
  //   rando.username = rando.name.slice(0,3) + randomNum();
  //   rando.password = rando.name.slice(0, 4).toLowerCase();
  //   rando.lastName = rando.name.slice(rando.name.lastIndexOf(" ")+1);
  //   return res.send(rando);
  // },

  addUser: function(req, res) {
    // console.log("rando", rando);
    // console.log("addadd", req.body);
    User.findOne({ email: req.body.email || rando.email }).exec().then(function(user) {
      if (user) {
        return res.status(409).end();
      }
      user = new User(req.body);
      // console.log("addUser Before Save ", req.body);
      user.save().then(function() {
        mandrillService.emailVerify(user);
      });
        // console.log("addUser After Save", req.body);
        return res.status(201).end();
      });
  },
  getUsers: function(req, res) {
    User.find({status : 'Active'}).exec().then(function(results) {
      return res.json(results);
    }).then(null, function(err) {
      return res.status(500).json(err);
    });
  },
  getUser: function(req, res) {
    User.findById(req.params.id).exec().then(function(results) {
      if(!results) {
        res.status(404);
      }
      else {
        return res.json(results);
      }
    }).then(null, function(err) {
      return res.status(500).json(err);
    });
  },

  updateUser: function(req, res) {
    User.update({_id: req.params.id}, req.body). exec().then(function(result) {
      return res.send('User Updated');
    }).then(null, function(err) {
      return res.status(500).json(err);
    });
  },

  /* This searches every member of every organization to find an ID that matches the current
  user's ID and then returns all the organizations where a match occurred  */
  getUserOrgs: function(req, res) {
    Org.find({}).exec().then(function(results) {
      var userOrgs = [];
      var ary =[];
      for (var i = 0; i < results.length; i++) {
        ary = results[i].members;
          for (var j = 0; j < ary.length; j++) {
            if(ary[j].userid === req.params.id) {
              userOrgs.push({org: results[i], role: ary[j].role});
            }
          }
      }
      // console.log("UserOrgs", userOrgs);
      return res.send(userOrgs);
    });
  },

  /* This searches every memeber of the Organization with the matching OrgID
  to find an user ID that matches the current user's ID and then returns the
  organization if a match occurred  */
  getUserOrg: function(req, res) {
    Org.findById({_id: req.params.orgID}).exec().then(function(results) {
      var userOrg;
      var ary =[];
      for (var i = 0; i < results.length; i++) {
        ary = results[i].members;
          for (var j = 0; j < ary.length; j++) {
            if(ary[j].userid === req.params.id) {
              userOrg = results[i];
            }
        }
    }
      // console.log("UserOrg", userOrg);
      return res.send(userOrg);
    });
  },

  /* This searches every memeber of the Organization with the matching OrgID
  to find an user ID that matches the current user's ID and if a match occurs
  then returns the user's organizational role */
  getUserRole: function(req, res) {
    Org.find({_id: req.params.orgID}).exec().then(function(results) {
      var userRole = "";
      var ary =[];
      for (var i = 0; i < results.length; i++) {
        ary = results[i].members;
          for (var j = 0; j < ary.length; j++) {
            if(ary[j].userid === req.params.id) {
              userRole = ary[j].role;
              break;
            }
            else {
              userRole = "User";
            }
        }
    }
      // console.log("UserRole", userRole);
      return res.send(userRole);
    });
  },

  validateEmail: function(req, res) {
    console.log("Clicked Email Verification Link", req.params);
    User.findById({_id: req.params.userID}).exec().then(function(user){
      if(!user) {
        return res.status(404).end();
      }
      else {
        user.validatedEmail = true;
        user.save().then(function() {
          mandrillService.welcomeEmail(user);
          res.send(user.firstName + "'s email has been validated!");
          return res.status(200).end();
        });
      }
    });
}

};
