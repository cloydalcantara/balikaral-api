const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const validationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  type:{
    type: String
  },
  action: String,
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "reviewerManagement"
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: "exam"
  },
  reason: String
});

// Create a model
const Validation = mongoose.model('validation', validationSchema);

// Export the model
module.exports = Validation;