const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const learningStrandSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level:{
    type: Schema.Types.ObjectId,
    ref: "level"
  },
  description:{
    type: String
  },
  noOfQuestions: {
    type: Number //automatic update on add and remove of questions
  }
});

// Create a model
const LearningStrand = mongoose.model('learningStrand', learningStrandSchema);

// Export the model
module.exports = LearningStrand;