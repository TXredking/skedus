var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var User = require('./userSchema');
var Appt = require('./apptSchema');


var orgSchema = new Schema({
  name: {type: String, index: true, required: true, unique: true},
  members: [{
    userid: {type: String, ref: "User"},
    role: {type: String, enum: ['Admin', 'Mentor', 'User']},
  }],
  apts: [{type: String, ref: "Appt"}],
  desc: {type: String},
  add1: {type: String},
  add2: {type: String, default: ""},
  city: {type: String},
  st: {type: String},
  zip: {type: String},
  linkedin: {type: String},
  facebook: {type: String},
  twitter: {type: String},
  image: {type: String},
  status: {
    type: String,
    required: true,
    default: 'Active',
    enum: ['Active', 'Archived', 'Pending']
  }
},{timestamps: true});



module.exports = mongoose.model('Org', orgSchema);
