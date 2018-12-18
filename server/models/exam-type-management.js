const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const examTypeSchema = new Schema({
  examType: {
    type: String,
    required: true //pre test, adaptive test, post test
  },
  examDescription: String,
  difficulty: {
    easy: Number, //ex 50
    medium: Number, 
    hard: Number
  },
  examTotal: Number,
  passingRate: Number
  totalHours: String
});

// Create a model
const ExamType = mongoose.model('examType', examTypeSchema);

// Export the model
module.exports = ExamType;