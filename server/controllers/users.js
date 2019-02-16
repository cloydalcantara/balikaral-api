const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');
const AuditTrail = require('../models/auditTrail')
const nodemailer = require('nodemailer');

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
    console.log("req.body",req.body)
    const { email, password, firstName, lastName, middleName, gender, birthday ,userType, level, civilStatus, learningCenter } = req.body;
    
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }
    
    // Create a new user
    let newUserData = {
      method: 'local',
      local: {
        email: email, 
        password: password,
        userType: userType,
        disabled: true
      },
      personalInformation: {
        firstName:firstName,
        lastName:lastName,
        middleName:middleName,
        gender: gender,
        birthday: birthday,
        civilStatus: civilStatus,
        learningCenter: learningCenter,
      }
    }
    if(userType === 'Learner'){
      newUserData = {...newUserData, userSettings: { level: level }}
    }
    const newUser = new User(newUserData);

    const userSave = await newUser.save();
    if(userSave){

      mailOptions = {
        from: 'balikaralsocmed@gmail.com',
        to: userSave.local.email,
        subject: 'Email verification!',
        text: 'Click the link to verify your account https://balikaral.com/verify/'+userSave._id
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });      

      res.status(200).json({message:'Account Created'})
    }
    // Generate the token
    // const token = signToken(newUser);
    // Respond with token
    // res.status(200).json({ token });
    

  },

  signUpFacebook: async (req, res, next) => {
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "facebook.email": req.body.email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }
    // Create a new user
    let newUserData = {
      method: 'facebook',
      facebook: {
        id: req.body.id,
        email: req.body.email,
        disabled: true,
        userType: req.body.userType,
      },
      personalInformation: {
        firstName: req.body.name,
        lastName: '',
        middleName: '',
        gender: '',
        birthday: '',
        civilStatus: '',
        learningCenter: '',
      }
    }
    if(req.body.userType==='Learner'){
      newUserData = {...newUserData, userSettings: { level: req.body.level }, personalInformation: {learningCenter: req.body.learningCenter}}
    }
    const newUser = new User(newUserData);
    await newUser.save();
    // Generate the token
    // const token = signToken(newUser);
    // Respond with token
    // res.status(200).json({ token });
    res.status(200).json({message:'Facebook Account Created'})
  },
  signUpGoogle: async (req, res, next) => {
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "google.email": req.body.email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }
    // Create a new user
    let newUserData = { 
      method: 'google',
      google: {
        id: req.body.id,
        email: req.body.email,
        disabled: true,
        userType: req.body.userType,
      },
      personalInformation: {
        firstName: req.body.name,
        lastName: '',
        middleName: '',
        gender: '',
        birthday: '',
        civilStatus: '',
        learningCenter: '',
      }
    }
    if(req.body.userType==='Learner'){
      newUserData = {...newUserData, userSettings: { level: req.body.level }, personalInformation: {learningCenter: req.body.learningCenter}}
    }
    const newUser = new User(newUserData);
    await newUser.save();
    // Generate the token
    // const token = signToken(newUser);
    // Respond with token
    // res.status(200).json({ token });
    res.status(200).json({message:'Google Account Created'})
  },

  signIn: async (req, res, next) => {
    // Generate token
    console.log(req.user)
    if(req.user && req.user.local && req.user.local.disabled ){
        res.status(200).json({ disabled: true });
    }else if(req.user && req.user.local && !req.user.local.disabled){
        const token = signToken(req.user);
        res.status(200).json({ token , data:req.user});
    }else{
      res.status(200).json({ account: 'No Account Match' });
    }
   
    
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    if(req.user && req.user.google && req.user.google.disabled ){
        res.status(200).json({ disabled: true });
    }else if(req.user && req.user.google && !req.user.google.disabled ){
      const token = signToken(req.user);
      res.status(200).json({ token, data: req.user });
    }else{
      res.status(200).json({ account: 'No Account Match' });
    }
    
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    if(req.user && req.user.facebook && req.user.facebook.disabled ){
        res.status(200).json({ disabled: true });
    }else if(req.user && req.user.facebook && !req.user.facebook.disabled ){
        const token = signToken(req.user);
        res.status(200).json({ token, data: req.user });
    }else{
      res.status(200).json({ account: 'No Account Match' });
    }
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
  checkIfEmailExist: async (req, res, next) => {
      const local = await User.find({ "local.email": req.query.email }).count().exec()
      const facebook = await User.find({ "facebook.email": req.query.email }).count().exec()
      const google = await User.find({ "google.email": req.query.email }).count().exec()
      let count = 0
      count = local + facebook + google
      res.json({count: count})
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

        birthday: req.body.birthday,
        civilStatus: req.body.civilStatus,

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
    const user  = await User.findOne({_id: req.params.id}).exec()
    console.log(user)
 
    let data = {}
    if(req.body.password === '' || !req.body.password){
      data = {
        local:{
          password: user.local.password,
          email: req.body.email,
          disabled: req.body.disabled,
          userType: req.body.userType,
        }
      }
    }else{
      data = {
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
    }

    
    
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  updateSocialInfo: async (req, res, next) => {
    let data = {}
    if(req.query.type === 'facebook'){
      data = {
        facebook:{
          id: req.body.id,
          email: req.body.email,
          disabled: req.body.disabled,
          userType: req.body.userType,
          name: req.body.name
        }
      }
    }
    if(req.query.type === 'google'){
      data = {  
        google: {
          id: req.body.id,
          email: req.body.email,
          disabled: req.body.disabled,
          userType: req.body.userType,
          name: req.body.name
        }
      }
    }
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },

  fetchToEdit: async (req,res,next)=>{
    const find = await User.findOne({_id: req.params.id}).exec()
    let personalInformation = find.personalInformation

    if((personalInformation.gradeLevel === '' || !personalInformation.gradeLevel) && (personalInformation.reasongForStopping === '' || !personalInformation.reasongForStopping) && (personalInformation.lifeStatus === '' || !personalInformation.lifeStatus) && (personalInformation.about === '' || !personalInformation.about)) {
      res.json({learnerStatus: 'Edit Profile', method: find.method})
    }else if(personalInformation.gradeLevel === '' || personalInformation.reasongForStopping === '' || personalInformation.lifeStatus === '' || personalInformation.about === ''){
      res.json({learnerStatus: 'Need Update', method: find.method})
    }
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
  delete: async (req, res, next) => {
    const remove = await User.remove({_id:req.params.id}).exec()
    res.json({message: "Deleted!"})
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

        civilStatus: req.body.civilStatus,
        birthday: req.body.birthday,
        learningCenter: req.body.learningCenter,
        gradeLevel: req.body.gradeLevel,
        reasongForStopping: req.body.reasongForStopping,
        lifeStatus: req.body.lifeStatus,

        gender: req.body.gender,

        about: req.body.about

      }
    }
    const update = await User.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    const find = await User.findOne({_id:req.params.id}).exec()
    res.json({data: find})
  },
  genderCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in pie chart
    const gendertotal = await User.find({}).countDocuments().exec()
    const male = await User.find({"personalInformation.gender":"Female"}).countDocuments().exec()
    const female = await User.find({"personalInformation.gender":"Male"}).countDocuments().exec()
    res.json({
      male: male, 
      female: female,
      nogender: gendertotal - (male + female),
      gendertotal: gendertotal
    })
  },
  ageCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    
    const userTotal = await User.find({}).exec()
    
    let users = []
    let noBirthday = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.birthday){
        users.push(Math.round((Date.now() - new Date(userTotal[i].personalInformation.birthday).getTime())/31536000000))
      }else{
        noBirthday = noBirthday + 1
      }
    }
    var counts = {};
    users.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({counts:counts,noBirthday:noBirthday, total: userTotal.length})
  },
  occupationCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    const total = await User.find({}).exec()
    const none = await User.find({"personalInformation.occupation":"none"}).exec()
    const fulltime = await User.find({"personalInformation.occupation":"fulltime"}).exec()
    const parttime = await User.find({"personalInformation.occupation":"parttime"}).exec()
    res.json({none,fulltime,parttime,total})
  },
  regionCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    
    const userTotal = await User.find({}).exec()
    
    let region = []
    let noRegion = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.province){
        region.push(userTotal[i].personalInformation.province)
      }else{
        noRegion = noRegion + 1
      }
    }
    var counts = {};
    region.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({region:counts,noRegion:noRegion, total: userTotal.length})
  },
  yearsInAlsCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    const userTotal = await User.find({}).exec()
    
    let yearsInAls = []
    let noYear = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.yearsInAls){
        yearsInAls.push(userTotal[i].personalInformation.yearsInAls)
      }else{
        noYear = noYear + 1
      }
    }
    var counts = {};
    yearsInAls.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({yearsInAls:counts,noYear:noYear, total: userTotal.length})
  },
  registeredExamineeCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in pie chart
    const userTotal = await User.find({}).countDocuments().exec()
    const Yes = await User.find({"personalInformation.registeredExaminee": "Yes"}).countDocuments().exec()
    const No = await User.find({"personalInformation.registeredExaminee": "No"}).countDocuments().exec()
    res.json({ Yes:Yes, No: No, total: userTotal, NoData: userTotal - (Yes+No)})
  },
  // Teacher stats
  letPasserCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in pie chart
    const userTotal = await User.find({}).countDocuments().exec()
    const Yes = await User.find({"personalInformation.letPasser": "Yes"}).countDocuments().exec()
    const No = await User.find({"personalInformation.letPasser": "No"}).countDocuments().exec()
    res.json({ Yes:Yes, No: No, total: userTotal, NoData: userTotal - (Yes+No)})
  },
  noOfYearsTeachingCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    const userTotal = await User.find({}).exec()
    
    let noOfYearsTeaching = []
    let noYear = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.noOfYearsTeaching){
        noOfYearsTeaching.push(userTotal[i].personalInformation.noOfYearsTeaching)
      }else{
        noYear = noYear + 1
      }
    }
    var counts = {};
    noOfYearsTeaching.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({noOfYearsTeaching:counts,noYear:noYear, total: userTotal.length})
  },
  noOfYearsAsAlsTeacherCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    const userTotal = await User.find({}).exec()
    
    let noOfYearsAsAlsTeacher = []
    let noYear = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.noOfYearsAsAlsTeacher){
        noOfYearsAsAlsTeacher.push(userTotal[i].personalInformation.noOfYearsAsAlsTeacher)
      }else{
        noYear = noYear + 1
      }
    }
    var counts = {};
    noOfYearsAsAlsTeacher.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({noOfYearsAsAlsTeacher:counts,noYear:noYear, total: userTotal.length})
  },
  subjectExpertiseCount: async (req,res,next)=>{
    // STATISTICS 
    // Display in bar chart
    const userTotal = await User.find({}).exec()
    
    let subjectExpertise = []
    let noYear = 0
    for(let i = 0; i < userTotal.length; i++){
      if(userTotal[i].personalInformation.subjectExpertise){
        for(let a = 0; a < userTotal[i].personalInformation.subjectExpertise.length; a++){
          subjectExpertise.push(userTotal[i].personalInformation.subjectExpertise[a].name)
        }
      }else{
        noYear = noYear + 1
      }
    }
    var counts = {};
    subjectExpertise.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    res.json({subjectExpertise:counts,noYear:noYear, total: userTotal.length})
  }
}