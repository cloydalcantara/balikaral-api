const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const positionprofileSchema = new Schema({
  plantilla: {
    type: Schema.Types.ObjectId,
    ref: "plantilla",
    required: true
  },
  competency: {
    type: Schema.Types.ObjectId,
    ref: "competencyframework",
    required: true
  },
  level: {
    type: String,
    required: true
  }
});

// Create a model
const Positionprofile = mongoose.model('positionprofile', positionprofileSchema);

// Export the model
module.exports = Positionprofile;