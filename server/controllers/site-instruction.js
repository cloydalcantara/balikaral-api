const JWT = require('jsonwebtoken');
const Model = require('../models/site-instruction');
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')


module.exports = {
  add: async (req, res, next) => {
   
    let postData = {
      title: req.body.title,
      description: req.body.description,
     
      instructionFor: req.body.instructionFor,
      image: req.files.image ? req.files.image[0].filename : null,

    }
    const data = new Model(postData)
    const save = await data.save() 
    if(save){
      const trail = {
        title: "Insert  Site Instruction.",
        user: req.query.userId,
        module: " Site Instruction",
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
      if(query.instructionFor){
        findQuery = {...findQuery, instructionFor: query.instructionFor}
      }
    }
    const count = await Model.find(findQuery).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find(findQuery).skip(skip).limit(10).exec()
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
  fetchWithoutPagination: async (req, res, next) => {
    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.instructionFor){
        findQuery = {...findQuery, instructionFor: query.instructionFor}
      }
    }
    const find = await Model.find(findQuery).exec()
      res.json({
        data: find       
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
        title: "Delete Site Instruction.",
        user: req.query.userId,
        module: "Site Instruction",
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

    let putData = {
      title: req.body.title,
      description: req.body.description,
     
      instructionFor: req.body.instructionFor,
      image: req.files.image ? req.files.image[0].filename : req.body.imageText,

    }
   
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:putData}).exec()
    if(update){
      const trail = {
        title: "Edit Site Instruction.",
        user: req.query.userId,
        module: "Site Instruction",
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