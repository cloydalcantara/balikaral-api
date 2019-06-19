const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'balikaralsocmed@gmail.com',
    pass: 'balikaraladmin'
  }
});


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
    const { 
      firstName,
      middleName,
      lastName,
      suffix,
      houseno,
      barangay,
      employeeid,
      city,
      province,
      gender,
      birthday,
      civilStatus,
      administrator,
      focal,
      role,
      plantilla,
      office,
      division,
      password
     } = req.body.data;
     const salt = await bcrypt.genSalt(10);
     // Generate a password hash (salt + hash)
     const passwordHash = await bcrypt.hash(password ? password : "password123", salt);
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "employeeid": employeeid });
    if (foundUser) { 
      return res.status(403).json({ error: 'Employee ID is already in use'});
    }
    
    // Create a new user
    let newUserData = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      suffix: suffix,
      houseno: houseno,
      barangay: barangay,
      city: city,
      province: province,
      gender: gender,
      birthday: birthday,
      civilStatus: civilStatus,
      employeeid: employeeid,
      administrator: administrator,
      focal: focal,
      role: role,
      plantilla: plantilla,
      office: office,
      password: passwordHash
    }
    if(division){
      newUserData.division = division
    }

    const newUser = new User(newUserData);

    const userSave = await newUser.save();
    console.log(userSave)
    if(userSave){
      res.status(200).json({message:'Account Created'})
    }
  },
  signIn: async (req, res, next) => {
    // Generate token
    console.log(req.user)
    if(req.user && req.user){
        const token = signToken(req.user);
        res.status(200).json({ token , data:req.user});
    }else{
      res.status(200).json({ account: 'No Account Match' });
    }
   
    
  },
  fetchAll: async (req, res, next) => {
    
    const count = await User.find({}).countDocuments().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await User.find({}).populate([{path:"division"},{path:"office"},{path:"plantilla"}]).skip(skip).limit(10).exec()
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
  fetchAllWithoutPagination: async (req, res, next) => {
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.type){
        findQuery = {...findQuery, "local.userType": query.type}
      }
      if(query.notType){
        findQuery = {...findQuery, "local.userType": { $ne: query.notType } }
      }
    }
    const find = await User.find(findQuery).populate([{path:"personalInformation.subjectExpertise.learningStrand"}]).exec()
      res.json({
        data: find,
    })
  },
  assessment: async (req, res, next) => { 
    // Incomplete
    // Complete
    let counter = 0
    let data = {
      schedule: req.body.data[0].schedule,
      status: "",
      assessor: req.body.data[0].assessor,
      competency: []
    }

    for(let i = 0; i < req.body.data.length; i++){
      if(!req.body.data[i].grade){
        counter = counter + 1
      }
      data.competency.push({
        competency: req.body.data[i].competency._id,
        indicators: req.body.data[i].indicators.indicators,
        level: req.body.data[i].indicators.level,
        grade: req.body.data[i].grade
      })
    }
    if(counter > 0){
      data.status = "Incomplete"
    }else{
      data.status = "Complete"
    }

    const update = await User.findOneAndUpdate({_id:req.params.id},{
      $push: {assessment: data}
    }, {useFindAndModify: false}).exec()
    if(update){
      res.json({success: true})
    }else{
      res.json({success: false})
    }
  },
  fetchSingle: async (req, res, next) => { 
    const find = await User.findOne({_id:req.params.id}).populate([{path:"personalInformation.subjectExpertise.learningStrand"}]).exec()
    res.json({data: find})
  },
  fetchTab: async (req, res, next) => { 
    const count = await User.find({office:req.params.id}).countDocuments().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await User.find({office:req.params.id}).populate([{path:"division"},{path:"office"},{path:"plantilla"}]).skip(skip).limit(10).exec()
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
  update: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
     // Generate a password hash (salt + hash)
     const passwordHash = await bcrypt.hash(req.body.password, salt);
    let data = {
      employeeid: req.body.employeeid,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      suffix: req.body.suffix,
      password: req.body.password,
      houseno: req.body.houseno,
      barangay: req.body.barangay,
      city: req.body.city,
      province: req.body.province,
      gender: req.body.gender,
      birthday: req.body.birthday,
      civilStatus: req.body.civilStatus,
      role: req.body.role,
      administrator: req.body.administrator,
      focal: req.body.focal,
      plantilla: req.body.plantilla,
      office: req.body.office,
    }
    if(req.body.division){
      data.division = req.body.division
    }
    if(req.body.password){
      data.password = passwordHash
    }
    const update = await User.findOneAndUpdate({_id:req.params.id},{
      $set: data
    }, {useFindAndModify: false}).exec()
    if(update){
      res.json({success: true})
    }else{
      res.json({success: false})
    }
  },
  delete: async (req, res, next) => {
    const remove = await User.remove({_id:req.params.id}).exec()
    res.json({message: "Deleted!"})
  }
}