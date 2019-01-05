const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const landingPageSchema = new Schema({
  active: Boolean,
  logo: String,
  pageDescription: String, //tayo na at mag balik aral description,
  pageLogo: String,
  tungkolSaProgramaDescription: String,
  tungkolSaProgramaLogo: String,
 
  email: String,
  contact: String,
  
  facebook: String, //link
  twitter: String,
  instagram: String,
  medium: String,
  google: String
});

// Create a model
const LandingPage = mongoose.model('landingpage', landingPageSchema);

// Export the model
module.exports = LandingPage;