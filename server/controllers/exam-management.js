const JWT = require('jsonwebtoken');
const Model = require('../models/exam-management');
const ExamType = require('../models/exam-type-management')
const { JWT_SECRET } = require('../configuration');
const csvtojson = require('csvtojson')
const rquery = require('mongoose-query-random')
module.exports = {
  add: async (req, res, next) => {
    console.log(req.files)
    let addData = {
      level: req.body.level,
      learningStrand: req.body.learningStrand,
      uploader: req.body.uploader,
      validation: req.body.validation,
       question:{
        details: req.body.questionDetails,
        images: req.files.questionImage ? req.files.questionImage[0].filename : null,
        choices:{
          a:{
            image: req.files.aImage ? req.files.aImage[0].filename : null,
            details: req.body.aDetails
          },
          b:{
            image: req.files.bImage ? req.files.bImage[0].filename : null,
            details: req.body.bDetails
          },
          c:{
            image: req.files.cImage ? req.files.cImage[0].filename : null,
            details: req.body.aDetails
          },
          d:{
            image: req.files.dImage ? req.files.dImage[0].filename : null,
            details: req.body.dDetails
          },
          
        },
        answer: req.body.answer,
        difficulty: req.body.difficulty
      },
      
    }

    const data = new Model(addData)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.uploader){
        findQuery = {...findQuery, uploader: query.uploader}
      }
      if(query.disclude){
        findQuery = {...findQuery, uploader: { $ne: query.disclude } }
      }
      if(query.validation){
        findQuery = {...findQuery, validation: query.validation }
      }
      if(query.learningStrand){
        findQuery = {...findQuery, learningStrand: query.learningStrand }
      }
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
    }
   const find = await Model.find(findQuery).populate([{path:"level"},{path:"learningStrand"},{path:"uploader"},{path:"validator.user"}]).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"level"},{path:"learningStrand"},{path:"uploader"},{path:"validator.user"}]).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    res.json({message: "Deleted!"})
  },
  update: async (req, res, next) => {
    let updateData = {
      level: req.body.level,
      learningStrand: req.body.learningStrand,
      uploader: req.body.uploader,
      validation: req.body.validation,
       question:{
        details: req.body.questionDetails,
        images: req.files.questionImage ? req.files.questionImage[0].filename : req.body.questionImageText,
        choices:{
          a:{
            image: req.files.aImage ? req.files.aImage[0].filename : req.body.aImageText,
            details: req.body.aDetails
          },
          b:{
            image: req.files.bImage ? req.files.bImage[0].filename : req.body.bImageText,
            details: req.body.bDetails
          },
          c:{
            image: req.files.cImage ? req.files.cImage[0].filename : req.body.cImageText,
            details: req.body.aDetails
          },
          d:{
            image: req.files.dImage ? req.files.dImage[0].filename : req.body.dImageText,
            details: req.body.dDetails
          },
          
        },
        answer: req.body.answer,
        difficulty: req.body.difficulty
      }
    }

    const data = updateData
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  validate: async (req, res, next) => {
    const data = {
      validator: req.body.validator,
      validation: req.body.validation
    }
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  //for PRE - TEST
  fetchExam: async( req, res, next ) => { 
    const fetchExamType = await ExamType.findOne({_id: req.query.examId}).populate({path:"learningStrand"}).exec()

    await Model.find({ "learningStrand": {$eq: fetchExamType.learningStrand}, "question.difficulty":{$eq:"Easy" } }).random(fetchExamType.difficulty.easy, true, function(err, data) {
      if (err) throw err;
      const easy = data
      Model.find({ "learningStrand": {$eq: fetchExamType.learningStrand}, "question.difficulty":{ $eq:"Medium" } }).random(fetchExamType.difficulty.medium,true, function(err, data){
        if (err) throw err;
        const medium = data
        Model.find({ "learningStrand": {$eq: fetchExamType.learningStrand}, "question.difficulty":{ $eq:"Hard" } }).random(fetchExamType.difficulty.hard, true, function(err, data){
          if (err) throw err;
          const hard = data
          res.json({easy: easy, medium: medium, hard:hard, examType:fetchExamType})
        })
      })
    });
  },
  upload: async( req, res, next ) => {
    await csvtojson()
      .fromFile("csv/"+req.file.filename)
      .then((jsonObj)=>{
        
        jsonObj.forEach(element => {
          let data = {
            level : req.body.level,
            learningStrand : req.body.learningStrand,
            uploader: req.body.uploader,
            validation: req.body.validation,
            question:{
              details : element.Details,
              images : element.Images,
              choices:{
                a:{
                  image : element['A Image'],
                  details: element['A Details']
                },
                b:{
                  image : element['B Image'],
                  details: element['B Details']
                },
                c:{
                  image : element['C Image'],
                  details: element['C Details']
                },
                d:{
                  image : element['D Image'],
                  details: element['D Details']
                }
              },
              answer: element.Answer,
              difficulty: element.Difficulty
            }
          }
          const finalData = new Model(data)
          const insert = finalData.save()
        });

        res.json({data:"Inserted!"})
      })
  }
}