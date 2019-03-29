const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const practiceExaminationSchema = new Schema({
  question: [],
  status:{
    type: Boolean
  },
  answer: String
});

// Create a model
const PracticeExamination = mongoose.model('practiceExamination', practiceExaminationSchema);

// Export the model
module.exports = PracticeExamination;