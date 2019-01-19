const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const reviewerManagementSchema = new Schema({
  learningStrand : {
      type: Schema.Types.ObjectId,
      ref: "learningStrand",
      required: true
  },
  level : {
      type: Schema.Types.ObjectId,
      ref: "level",
  },
  pdf: {
    type: String
  },
  youtubeVideo: {
    type: String
  },
  description: {
      type: String
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "user",
    // required: true
  },
  //if ang uploader ay teacher. false ang default. Yung counter ay 0
  //if ang uploader ay admin true agad
  //flow maraming teacher ang makakapagview ng validated na pdf. Ang admin makakapagvalidate ng pdf. 
  //pero pwede rin ang ibang teacher na makapagvalidated ng mga pdf. Dun sa validationCounter mag aadd kapag may isang teacher na nagclick na validated yun. Magiging true lang yung validation kung more than 3 ang nagvalidate.

  validator: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  validation: Boolean,
  learningStrandSub: {
    type: Schema.Types.ObjectId,
    ref: 'learningStrandSub'
  }
});

// Create a model
const ReviewerManagement = mongoose.model('reviewerManagement', reviewerManagementSchema);

// Export the model
module.exports = ReviewerManagement;