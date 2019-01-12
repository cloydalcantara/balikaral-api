const JWT = require('jsonwebtoken');
const Model = require('../models/comment');
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')
module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    if(save){
      const trail = {
        title: "Insert comment!",
        user: req.query.userId,
        module: "Comment",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({ data: save });
    }
  },
  fetchAll: async (req, res, next) => {
    const count = await Model.find({}).populate([{path:"forum"},{path:"user"}]).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find({}).populate([{path:"forum"},{path:"user"}]).skip(skip).limit(10).exec()
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
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"forum"},{path:"user"}]).exec()
    res.json({data: find})
  },
  fetchByForum: async (req, res, next) => {
    const count = await Model.find({forum:req.params.id}).populate([{path:"forum"},{path:"user"}]).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find({forum:req.params.id}).populate([{path:"forum"},{path:"user"}]).skip(skip).limit(10).exec()
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
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      const trail = {
        title: "Delete comment!",
        user: req.query.userId,
        module: "Comment",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner
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
        title: "Edit comment!",
        user: req.query.userId,
        module: "Comment",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
    
  }
}