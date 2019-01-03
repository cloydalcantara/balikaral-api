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
    const count = await Model.find(findQuery).populate({path:"learningStrand"}).sort([['learningStrand', -1]]).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find(findQuery).populate({path:"learningStrand"}).sort([['learningStrand', -1]]).skip(skip).limit(10).exec()
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