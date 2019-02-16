const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const examTypeSchema = new Schema({
  examType: {
    type: String,
    required: true //Pre Test, Post Test, Adaptive Test
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'level'
  },
  examDescription: String,
  learningStrandQuestions: [
    {
      learningStrand: {
        type: Schema.Types.ObjectId,
        ref: 'learningStrand'
      },
      total: Number
    },
  ],
  examTotal: Number,
  totalHours: Number
});

// Create a model
const ExamType = mongoose.model('examType', examTypeSchema);

// Export the model
module.exports = ExamType;
