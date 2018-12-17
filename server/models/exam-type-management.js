const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const examTypeSchema = new Schema({
  exam_type: {
    type: String,
    required: true //pre test, adaptive test, post test
  },
  exam_description: String,
  difficulty: {
    easy: Number, //ex 50
    medium: Number, 
    hard: Number
  },
  exam_total: Number,
  passing_rate: Number
});

// Create a model
const ExamType = mongoose.model('examType', examTypeSchema);

// Export the model
module.exports = ExamType;