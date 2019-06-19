const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const audittrailSchema = new Schema({
  module:{
    type: String
  },
  method:{
    type: String
  },
  office: {
    type: Schema.Types.ObjectId,
    ref: "office"
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: "division"
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: "assessmentschedule"
  }
});

// Create a model
const Audittrail = mongoose.model('audittrail', audittrailSchema);

// Export the model
module.exports = Audittrail;