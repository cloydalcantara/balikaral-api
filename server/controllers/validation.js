const JWT = require('jsonwebtoken');
const Model = require('../models/validation');
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')
const groupArray = require('group-array');

module.exports = {
  add: async (req, res, next) => {
    const data = new Model(req.body)
    console.log(req.body)
    const save = await data.save() 
    if(save){
      const trail = {
        title: "Validation",
        user: req.query.userId,
        module: "Reviewer/Examination",
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
  fetchValidated: async (req, res, next) => {
   
    const count = await Model.find({user: req.query.user,type: req.query.type, action: req.query.action}).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find({user: req.query.user,type: req.query.type, action: req.query.action}).populate([{path:"reviewer"},{path:"user"}]).skip(skip).limit(10).exec()
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
  fetchValidation: async (req, res, next) => {
    console.log(req.query)
    const data = await Model.aggregate([
    {
      "$match" : { type: req.query.type, action: req.query.action }
    },
    {
      "$group": {
          _id: {
              type: "$type",
              user: "$user",
              action: "$action",
              reviewer: "$reviewer"
          },
          count: {
              $sum: 1
          }
      }
    },
    {"$lookup": {from: 'users', localField: '_id.user', foreignField: '_id', as: 'users'}},
    {"$lookup": {from: 'reviewermanagements', localField: '_id.reviewer', foreignField: '_id', as: 'reviewer'}},
    {"$sort": {count: -1}}
  ])
     
     res.json({data})
  
    // const fetch = await Model.find({action: req.query.action, user: req.query.user  }).populate([{path:"user"},{path:"reviewer"}])
    
    // res.json({data: groupArray(fetch, 'action')})
  }
}