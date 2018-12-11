const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const examSchema = new Schema({
  level:{
    type: String,
    // ref: "level"
  },
  learningStrand:{
    type: String,
    // ref: "learningStrand"
  },
  question:{
    details:{
      type: String
    },
    images:{
      type: String
    },
    choices:{
      a:{
        type:{
          type:String
        },
        details:{
          type: String
        }
      },
      b:{
        type:{
          type:String
        },
        details:{
          type: String
        }
      },
      c:{
        type:{
          type:String
        },
        details:{
          type: String
        }
      },
      d:{
        type:{
          type:String
        },
        details:{
          type: String
        }
      }
    },
    answer:{
      type: String
    },
    difficulty: String
  }
});

// Create a model
const Exam = mongoose.model('exam', examSchema);

// Export the model
module.exports = Exam;