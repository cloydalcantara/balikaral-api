const JWT = require('jsonwebtoken');
const Model = require('../models/exam-type-management');
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')
module.exports = {
  add: async (req, res, next) => {
    console.log(req.query.userId)
    const data = new Model(req.body)
    const save = await data.save() 
    
    if(save){
      const trail = {
        title: "Update Examination Type.",
        user: req.query.userId,
        module: "Exam Type Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({ data: save });
    }
    
  },
  fetchAll: async (req, res, next) => { 
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.hidePreTest){
        findQuery = {...findQuery, examType: {$ne: 'Pre Test'}}
      }
      if(query.hidePostTest){
        findQuery = {...findQuery, examType: {$nin: ['Pre Test', 'Post Test']}} 
      }
      if(query.level){
        findQuery = {...findQuery, level: query.level}
      }
    }
    const count = await Model.find(findQuery).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find(findQuery).populate([{path:"level"}, {path: "learningStrandQuestions.learningStrand"}]).skip(skip).limit(10).exec()
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
  fetchPreTest: async (req, res, next) => {
    const find = await Model.find({examType: {$eq: 'Pre Test'}}).populate({path:"level"}).exec()
    res.json({ data: find })
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate({path:"level"}).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      const trail = {
        title: "Delete Examination Type.",
        user: req.query.userId,
        module: "Exam Type Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({message: "Deleted!"})
    }
    
  },
  update: async (req, res, next) => {
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      const trail = {
        title: "Edit Examination Type.",
        user: req.query.userId,
        module: "Exam Type Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
  }
}