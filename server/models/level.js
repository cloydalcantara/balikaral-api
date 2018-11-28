const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const levelSchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  description:{
    type: String
  }
});

// Create a model
const Level = mongoose.model('level', levelSchema);

// Export the model
module.exports = Level;