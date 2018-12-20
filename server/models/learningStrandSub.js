const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const learningStrandSubSchema = new Schema({
  learningStrand: {
    type: Schema.Types.ObjectId,
    ref: 'learningStrand'
  },
  lessonName: String,
  description: String
});

// Create a model
const LearningStrandSub = mongoose.model('learningStrandSub', learningStrandSubSchema);

// Export the model
module.exports = LearningStrandSub;