const JWT = require('jsonwebtoken');
const Model = require('../models/learningStrand');
const Exam = require('../models/exam-management');
const { JWT_SECRET } = require('../configuration');

module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {

    let findQuery = {}
    if(req.query){
      let query = req.query
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
    }
    const find = await Model.find(findQuery).populate({path:"level"}).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).exec()

    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    res.json({message: "Deleted!"})
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

    res.json({data: update})
  }
}