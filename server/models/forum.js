const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const forumSchema = new Schema({
  //student and teachers can post and comment in this group.
  forum:{
    type: Schema.Types.ObjectId,
    ref: "managementForum"
  },
  description:{
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user" 
  },
  initial_post: {
    title: String,
    description: String,
    image: String
  },
  datePosted: Date,
  comments: [
    {
      user: { 
          type: Schema.Types.ObjectId,
          ref: "user" 
      },
      dateComment: Date,
      comment: String
    }
  ] // comment_data, date and time
});

// Create a model
const Forum = mongoose.model('forum', forumSchema);

// Export the model
module.exports = Forum;