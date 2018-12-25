const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const resultSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'generatedExam'
  },
  percentagePerlearningStrand:[
    {
      learningStrand: { 
        type: Schema.Types.ObjectId,
        ref: 'learningStrand'
      },
      percentage: Number,
      score: Number,
      totalQuestion: Number,
      correct: Number,
      wrong: Number
    }
  ],
  examiner: {
    type: Schema.Types.ObjectId,
    ref:'user'
  },
  date: Date, 
  status: String //if 90% pataas ang score sa lahat ng subject.Tsaka lang sya magiging complete. Else retake
});

// Create a model
const Result = mongoose.model('result', resultSchema);

// Export the model
module.exports = Result;