const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const assessmentSchema = new Schema({
  competency:{
    type: Schema.Types.ObjectId,
    ref: "competencyframework"
  },
  indicators:[],
  score: Number,
  schedule: {
    type: Schema.Types.ObjectId,
    ref: "assessmentschedule",
    required: true
  },
  assessor: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

// Create a model
const Assessment = mongoose.model('assessment', assessmentSchema);

// Export the model
module.exports = Assessment;