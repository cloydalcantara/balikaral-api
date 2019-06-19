const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const announcementsSchema = new Schema({
  announcements_title:{
    type: String,
    required: true
  },
  announcements_description:{
    type: String,
    required: true
  }
});

// Create a model
const Announcements = mongoose.model('announcements', announcementsSchema);

// Export the model
module.exports = Announcements;