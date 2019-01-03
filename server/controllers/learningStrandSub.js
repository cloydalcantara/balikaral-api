const JWT = require('jsonwebtoken');
const Model = require('../models/learningStrandSub');
const ExamManagement = require('../models/exam-management')
const { JWT_SECRET } = require('../configuration');

module.exports = {
  add: async (req, res, next) => {
    const data = new Model(req.body)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {

    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.learningStrand){
        findQuery = {...findQuery, learningStrand: query.learningStrand }
      }
    }
    const find = await Model.find(findQuery).populate({path:"learningStrand"}).sort([['learningStrand', -1]]).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate({path:"learningStrand"}).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    res.json({message: "Deleted!"})
  },
  update: async (req, res, next) => {
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  }
}