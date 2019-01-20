const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const surveyManagementSchema = new Schema({
  
  criteria: String,
  descriptions: [ { description: String } ]
});

// Create a model
const SurveyManagement = mongoose.model('surveyManagement', surveyManagementSchema);

// Export the model
module.exports = SurveyManagement;