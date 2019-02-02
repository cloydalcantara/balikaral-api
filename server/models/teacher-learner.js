const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const teacherLearnerSchema = new Schema({
	teacher:{
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	learner:{
		type: Schema.Types.ObjectId,
		ref: "user"
	},
});

// Create a model
const TeacherLearner = mongoose.model('teacherLearner', teacherLearnerSchema);

// Export the model
module.exports = TeacherLearner;