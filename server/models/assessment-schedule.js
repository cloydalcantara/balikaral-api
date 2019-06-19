const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const assessmentscheduleSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  startdate:{
    type: String,
    required: true
  },
  deadlinedata:{
    type: String,
    required: true
  },
  activate:{
    type: Boolean,
    required: true
  },
});

// Create a model
const Assessmentschedule = mongoose.model('assessmentschedule', assessmentscheduleSchema);

// Export the model
module.exports = Assessmentschedule;