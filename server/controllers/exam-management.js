const JWT = require('jsonwebtoken');
const Model = require('../models/exam-management');
const ExamType = require('../models/exam-type-management')
const { JWT_SECRET } = require('../configuration');
const csvtojson = require('csvtojson')
const rquery = require('mongoose-query-random')
module.exports = {
  add: async (req, res, next) => {
    let addData = {
      level: req.body.level,
      learningStrand: req.body.learningStrand,
      uploader: req.body.uploader,
      validation: req.body.validation,
      question:{
        details: req.body.question.details,
        images: req.files.images[0],
        choices:{
          a:{
            type: req.body.adetails,
            details: req.files.a ? req.files.a[0].filename : req.body.question.choices.a
          },
          b:{
            type: req.body.bdetails,
            details: req.files.b ? req.files.b[0].filename : req.body.question.choices.b
          },
          c:{
            type: req.body.cdetails,
            details: req.files.c ? req.files.c[0].filename : req.body.question.choices.c
          },
          d:{
            type: req.body.ddetails,
            details: req.files.d ? req.files.d[0].filename : req.body.question.choices.d
          }
        },
        answer: req.body.answer,
        difficulty: req.body.difficulty
      }
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
        details: req.body.question.details,
        images: req.files.images[0],
        choices:{
          a:{
            type: req.body.adetails,
            details: req.files.a ? req.files.a[0].filename : req.body.question.choices.a
          },
          b:{
            type: req.body.bdetails,
            details: req.files.b ? req.files.b[0].filename : req.body.question.choices.b
          },
          c:{
            type: req.body.cdetails,
            details: req.files.c ? req.files.c[0].filename : req.body.question.choices.c
          },
          d:{
            type: req.body.ddetails,
            details: req.files.d ? req.files.d[0].filename : req.body.question.choices.d
          }
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
  fetchExam: async( req, res, next ) => {

    const fetchExamType = await ExamType.findOne({_id: req.query.examId}).exec()
    
    await Model.find({"difficulty":"easy"}).random(fetchExamType.difficulty.easy, true, function(err, data) {
      if (err) throw err;
      const easy = data
      Model.find({"difficulty":"medium"}).random(fetchExamType.difficulty.medium,true, function(err, data){
        if (err) throw err;
        const medium = data
        Model.find({"difficulty":"hard"}).random(fetchExamType.difficulty.hard,true, function(err, data){
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
                  type : element['A Type'],
                  details: element['A Details']
                },
                b:{
                  type : element['B Type'],
                  details: element['B Details']
                },
                c:{
                  type : element['C Type'],
                  details: element['C Details']
                },
                d:{
                  type : element['D Type'],
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