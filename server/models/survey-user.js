const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const surveyUserSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  date: Date,
  survey: [
    { criteria: String, 
      descriptions: [ { description: String, evaluation: String } ] 
    }
  ]
});

// Create a model
const SurveyUser = mongoose.model('surveyUser', surveyUserSchema);

// Export the model
module.exports = SurveyUser;