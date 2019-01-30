const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const siteInstructionSchema = new Schema({
  title: String,
  description:String,
  image: String,
  instructionFor: String
});

// Create a model
const SiteInstruction = mongoose.model('siteInstruction', siteInstructionSchema);

// Export the model
module.exports = SiteInstruction;