const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const auditTrailSchema = new Schema({
  title: String, // ex. Insert exam management, Update exam management etc.
  user: {
    type: Schema.Types.ObjectId,
    ref:'user'
  },
  date: Date,
  module: String, //para malaman kung saang module pupunta pagclick ng notif.
  // dito naman malalaman kung saang lang sya lalabas.
  validator: Boolean,
  contributor: Boolean,
  learner: Boolean  
});

// Create a model
const AuditTrail = mongoose.model('auditTrail', auditTrailSchema);

// Export the model
module.exports = AuditTrail;