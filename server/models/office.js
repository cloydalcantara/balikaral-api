const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const officeSchema = new Schema({
  office_name:{
    type: String,
    required: true
  },
  office_code:{
    type: String,
    required: true
  },
  office_description: String
});

// Create a model
const Office = mongoose.model('office', officeSchema);

// Export the model
module.exports = Office;