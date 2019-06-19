const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const competencyframeworkSchema = new Schema({
  competency_code:{
    type: String,
    required: true,
    unique: true
  },
  competency_name:{
    type: String,
    required: true
  },
  competency_category: String,
  competency_definition: String,
  core_description_basic: String,
  core_description_intermediate: String,
  core_description_advance: String,
  core_description_superior: String,
  competency_listing: [
    {
      level: String,
      indicators: String
    }
  ]
});

// Create a model
const Competencyframework = mongoose.model('competencyframework', competencyframeworkSchema);

// Export the model
module.exports = Competencyframework;