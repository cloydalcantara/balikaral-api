const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const positionSchema = new Schema({
  position_code:{
    type: String,
    required: true
  },
  position_name:{
    type: String,
    required: true
  },
  position_description: String,
  eligibility_requirements:{
    type: String
  },
  training_requirements:{
    type: String
  },
  experience_requirements: String,
  educational_requirements: String
});

// Create a model
const Position = mongoose.model('position', positionSchema);

// Export the model
module.exports = Position;