const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const examSchema = new Schema({
  level:{
    type: Schema.Types.ObjectId,
    ref: "level",
    required: true
  },
  learningStrand:{
    type: Schema.Types.ObjectId,
    ref: "learningStrand",
    required: true
  },
  learningStrandSub:{
    type: Schema.Types.ObjectId,
    ref: "learningStrandSub",
    required: true
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  validator: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  validation: Boolean,
  question:{
    details:{
      type: String
    },
    images:{
      type: String
    },
    choices:{
      a:{
        image:{
          type:String
        },
        details:{
          type: String
        }
      },
      b:{
        image:{
          type:String
        },
        details:{
          type: String
        }
      },
      c:{
        image:{
          type:String
        },
        details:{
          type: String
        }
      },
      d:{
        image:{
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
    difficulty: { 
      type:String
    }
  }
});

// Create a model
const Exam = mongoose.model('exam', examSchema);


// Export the model
module.exports = Exam;