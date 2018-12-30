const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const commentSchema = new Schema({
  //student and teachers can post and comment in this group.
  forum:{
    type: Schema.Types.ObjectId,
    ref: "forum"
  },
  
  user: { 
      type: Schema.Types.ObjectId,
      ref: "user" 
  },
  dateComment: Date,
  comment: String
});

// Create a model
const Comment = mongoose.model('comment', commentSchema);

// Export the model
module.exports = Comment;