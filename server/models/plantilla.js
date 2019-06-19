const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const plantillaSchema = new Schema({
  position:{
    type: Schema.Types.ObjectId,
    ref: "position",
    required: true
  },
  office:{
    type: Schema.Types.ObjectId,
    ref: "office",
    required: true
  },
  division:{
    type: Schema.Types.ObjectId,
    ref: "division",
    required: true
  },
  salarygrade:{
    type: Schema.Types.ObjectId,
    ref: "salarygrade",
    required: true
  },
  plantilla_code:{
    type: String,
    required: true
  },
  plantilla_name:{
    type: String,
    required: true
  },
  plantilla_description: String
});

// Create a model
const Plantilla = mongoose.model('plantilla', plantillaSchema);

// Export the model
module.exports = Plantilla;