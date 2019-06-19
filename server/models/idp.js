const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const idpSchema = new Schema({
  competency:{
    type: Schema.Types.ObjectId,
    ref: "competencyframework",
    required: true
  },
  target:{
    type: String,
    required: true
  }
});

// Create a model
const Idp = mongoose.model('idp', idpSchema);

// Export the model
module.exports = Idp;