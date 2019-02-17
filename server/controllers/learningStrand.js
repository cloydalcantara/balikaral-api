const JWT = require('jsonwebtoken');
const Model = require('../models/learningStrand');
const Exam = require('../models/exam-management');
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')


module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    if(save){
      const trail = {
        title: "Insert Learning Strand.",
        user: req.query.userId,
        module: "Learning Strand",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: new Date()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({ data: save });
    }
    
  },
  fetchWithoutPagination: async (req, res, next) => {
     let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
    }
    const find = await Model.find(findQuery).populate({path: "level"}).exec()
      res.json({
        data: find       
    })
  },
  fetchAll: async (req, res, next) => {
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
    }
    const count = await Model.find(findQuery).populate().count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10

    
    const find = await Model.find(findQuery).populate({path:"level"}).sort([['level', -1]]).skip(skip).limit(10).exec()
    res.json({data: find,
      currentPage: parseInt(req.query.page),
      previousPage: (parseInt(req.query.page) - 1 <= 0 ? null : parseInt(req.query.page) - 1),
      nextPage: (parseInt(count) > 10 && parseInt(req.query.page) != pageCount ? parseInt(req.query.page) + 1 : null ),
      perPage: 10,
      pageCount: pageCount,
      totalCount: count
    })
  },
  fetchAllWithQuestion: async ( req, res, next ) => {
    const count = await Model.find().populate().count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10

    const find = await Model.aggregate([
      {
        $lookup:
          {
            from: "exams",
            localField: "_id",
            foreignField: "learningStrand",
            as: "questions"
          }
     },
     { $skip : skip },
     { $limit : 10 }
    ]).exec((err, data) => {
        if (err) throw err;
        res.json({
          data: data,
          currentPage: parseInt(req.query.page),
          previousPage: (parseInt(req.query.page) - 1 <= 0 ? null : parseInt(req.query.page) - 1),
          nextPage: (parseInt(count) > 10 && parseInt(req.query.page) != pageCount ? parseInt(req.query.page) + 1 : null ),
          perPage: 10,
          pageCount: pageCount,
          totalCount: count
        })
    })
  },
  fetchAllWithReviewer: async ( req, res, next ) => {
    const count = await Model.find().populate().count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10

    const find = await Model.aggregate([
      {
        $lookup:
          {
            from: "reviewermanagements",
            localField: "_id",
            foreignField: "learningStrand",
            as: "reviewer"
          }
     },
     { $skip : skip },
     { $limit : 10 }
    ]).exec((err, data) => {
        if (err) throw err;
        res.json({
          data: data,
          currentPage: parseInt(req.query.page),
          previousPage: (parseInt(req.query.page) - 1 <= 0 ? null : parseInt(req.query.page) - 1),
          nextPage: (parseInt(count) > 10 && parseInt(req.query.page) != pageCount ? parseInt(req.query.page) + 1 : null ),
          perPage: 10,
          pageCount: pageCount,
          totalCount: count
        })
    })
  },
  fetchGeneratedExam: async ( req, res, next ) => {
    const count = await Model.find().populate().count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10

    const find = await Model.aggregate([
      {
        $unwind: "$percentagePerLearningStrand"
      },
      {
        $lookup:
          {
            from: "generatedExams",
            localField: "_id",
            foreignField: "_id",
            as: "learningStrandExam"
          }
      },
      {
          $match: { "learningStrandExam": { $ne: [] } }
      },
      { "$group": {
        "_id": "$_id",
        "learningStrandExam": { "$push": "$learningStrandExam" },
        "percentagePerLearningStrand": { "$push": "$percentagePerLearningStrand" }
      }}
    ]).exec((err, data) => {
        if (err) throw err;
        console.log(data);
        res.json({data: data})
    })
  },



  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).exec()

    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      const trail = {
        title: "Remove Learning Strand.",
        user: req.query.userId,
        module: "Learning Strand",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: new Date()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({message: "Deleted!"})
    }
    
  },
  update: async (req, res, next) => {
    const examList = await Exam.find({'learningStrand': { $eq: req.params.id } }).exec()
    const data = {
      name: req.body.name,
      level:req.body.level,
      description: req.body.description,
      noOfQuestions: examList.length
    }

    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      const trail = {
        title: "Edit Learning Strand.",
        user: req.query.userId,
        module: "Learning Strand",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: new Date()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
  }
}