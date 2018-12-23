const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const managementForumSchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  description:{
    type: String
  },
  learningStrand: {
    type: Schema.Types.ObjectId,
    ref: 'learningStrand'
  }
});

// Create a model
const ManagementForum = mongoose.model('managementForum', managementForumSchema);

// Export the model
module.exports = ManagementForum;