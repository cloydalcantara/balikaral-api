const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
  employeeid: Number,
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  suffix: {
    type: String
  },
  password: String,
  houseno: String,
  barangay: String,
  city: String,
  province: String,
  gender: String,
  birthday: String,
  civilStatus: String,
  role: String,
  administrator: Boolean,
  focal: Boolean,
  plantilla: {
    type: Schema.Types.ObjectId,
    ref:"plantilla"
  },
  office: {
    type: Schema.Types.ObjectId,
    ref:"office"
  },
  division: {
    type: Schema.Types.ObjectId,
    ref:"division"
  },
  assessment:[
    {
      schedule: {
        type: Schema.Types.ObjectId,
        ref: "schedule"
      },
      competency:[
        {
          competency: {
            type: Schema.Types.ObjectId,
            ref: "competencyframework"
          },
          indicators: String,
          level: String,
          grade: Number
        }
      ],
      status: String,
      assessor: {
        type: Schema.Types.ObjectId,
        ref: "user  "
      }
    }
  ]
});

userSchema.pre('save', async function(next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);
    console.log(passwordHash)
    // Re-assign hashed version over original, plain text password
    this.password = passwordHash;
    next();
  } catch(error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch(error) {
    throw new Error(error);
  }
}

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;