const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const assignedCompetencySchema = new Schema({
  office: {
    type: Schema.Types.ObjectId,
    ref: "office"
  },
  competency: {
    type: Schema.Types.ObjectId,
    ref: "competencyframework"
  }
});

// Create a model
const AssignedCompetency = mongoose.model('assignedcompetency', assignedCompetencySchema);

// Export the model
module.exports = AssignedCompetency;