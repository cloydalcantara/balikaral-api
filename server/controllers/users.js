const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');

signToken = user => {
  return JWT.sign({
    iss: 'BalikAral',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    console.log("req.body",req.body)
    const { email, password, firstName, lastName, middleName, houseNoStreet,
    barangay, city, province, zipcode, userType } = req.body;
    
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }
    
    // Create a new user
    const newUser = new User({ 
      method: 'local',
      local: {
        email: email, 
        password: password,
        userType: userType,
        disabled: false
      },
      personalInformation: {
        firstName:firstName,
        lastName:lastName,
        middleName:middleName,
        houseNoStreet:houseNoStreet,
        barangay:barangay,
        city:city,
        province:province
      }
    });

    await newUser.save();

    // Generate the token
    // const token = signToken(newUser);
    // Respond with token
    // res.status(200).json({ token });
    res.status(200).json({message:'Account Created'})

  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token , data:req.user});
    
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  fetchAll: async (req, res, next) => {
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.type){
        findQuery = {...findQuery, "local.userType": query.type}
      }
    }
    
    const count = await await User.find(findQuery).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await await User.find(findQuery).skip(skip).limit(10).exec()
      res.json({
        data: find,
        currentPage: parseInt(req.query.page),
        previousPage: (parseInt(req.query.page) - 1 <= 0 ? null : parseInt(req.query.page) - 1),
        nextPage: (parseInt(count) > 10 && parseInt(req.query.page) != pageCount ? parseInt(req.query.page) + 1 : null ),
        perPage: 10,
        pageCount: pageCount,
        totalCount: count
    })
  },
  fetchSingle: async (req, res, next) => {
    const find = await User.findOne({_id:req.params.id}).exec()
    res.json({data: find})
  },

  secret: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ secret: "resource" });
  },

  updatePersonalInfo: async (req, res, next) => {
    const data = {
      personalInformation:{
        image: req.body.image,

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,

        houseNoStreet: req.body.houseNoStreet,
        barangay: req.body.barangay,
        city: req.body.city,
        province: req.body.province,


        learningCenter: req.body.learningCenter,
        gradeLevel: req.body.gradeLevel,
        reasongForStopping: req.body.reasongForStopping,
        lifeStatus: req.body.lifeStatus,

        gender: req.body.gender,

        about: req.body.about
      }
    }
    
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },

  updateAccountInfo: async (req, res, next) => {
    let data = {
      local:{
        password: "",
        email: req.body.email,
        disabled: req.body.disabled,
        userType: req.body.userType,
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    data.local.password = passwordHash;
    
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },

  disable: async (req, res, next) => {
    const data = {
      local:{
        disabled: req.body.disabled
      }
    }
    
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  updatePreTest: async (req, res, next) => {
    const data = {
      userSettings:{
        disabled: req.body.hadPreTest
      }
    }
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  updatePicture: async (req, res, next) => {
    const data = {
      personalInformation: {
        image: req.file.filename,

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,

        houseNoStreet: req.body.houseNoStreet,
        barangay: req.body.barangay,
        city: req.body.city,
        province: req.body.province,


        learningCenter: req.body.learningCenter,
        gradeLevel: req.body.gradeLevel,
        reasongForStopping: req.body.reasongForStopping,
        lifeStatus: req.body.lifeStatus,

        gender: req.body.gender,

        about: req.body.about

      }
    }
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  }
}