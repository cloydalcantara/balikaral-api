const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const divisionSchema = new Schema({
  office_id:{
    type: Schema.Types.ObjectId,
    ref: "office",
    required: true
  },
  division_code:{
    type: String,
    required: true,
    unique: true
  },
  division_name:{
    type: String,
    required: true
  },
  division_description: String
});

// Create a model
const Division = mongoose.model('division', divisionSchema);

// Export the model
module.exports = Division;