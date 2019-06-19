const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const salarygradeSchema = new Schema({
  office:{
    type: String,
    required: true
  },
  salary_grade_name:{
    type: String,
    required: true
  },
  salary_grade_no:{
    type: String,
    required: true
  },
  step_1: Number,
  step_2: Number,
  step_3: Number,
  step_4: Number,
  step_5: Number,
  step_6: Number,
  step_7: Number,
  step_8: Number,
  status: Boolean
});

// Create a model
const Salarygrade = mongoose.model('salarygrade', salarygradeSchema);

// Export the model
module.exports = Salarygrade;