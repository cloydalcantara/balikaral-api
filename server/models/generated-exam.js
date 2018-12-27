const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const generatedExamSchema = new Schema({
  examType: {
    type: Schema.Types.ObjectId,
    ref: 'examType'
  },
  exam: [
    { 
      question: {
        type: Schema.Types.ObjectId,
        ref: 'exam'
      },
      answer: String
    }
  ],
  
  percentagePerlearningStrand:[
    {
      learningStrand: { 
        type: Schema.Types.ObjectId,
        ref: 'learningStrand'
      },
      percentage: Number,
      score: Number,
      totalQuestion: Number
    }
  ],

  type: String,

  examiner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  dateStarted: {
    type: Date
  },
  dateFinished: {
     type: Date
  },
  status: String, //completed, pending, 

  timeRemaining: String
});

// Create a model
const GeneratedExam = mongoose.model('generatedExam', generatedExamSchema);
generatedExamSchema.pre('save', async function(next) {
  try {
    this.dateStarted = Date.now;
    next();
  } catch(error) {
    next(error);
  }
});
// Export the model
module.exports = GeneratedExam;