const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const sessionGuideManagementSchema = new Schema({
  learningStrand : {
      type: Schema.Types.ObjectId,
      ref: "learningStrand",
      required: true
  },
  pdf: {
    type: String
  },
  description: {
      type: String
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "user",
    // required: true
  },
  validator: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  validation: Boolean
});

// Create a model
const SessionGuideManagement = mongoose.model('sessionGuideManagement', sessionGuideManagementSchema);

// Export the model
module.exports = SessionGuideManagement;