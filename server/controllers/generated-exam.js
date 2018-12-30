const JWT = require('jsonwebtoken');
const Model = require('../models/generated-exam');
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
      if(query.examiner){
        findQuery = {...findQuery, examiner: query.examiner}
      }
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
      if(query.status){
        findQuery = {...findQuery, status: query.status }
      }
    }
    const find = await Model.find(findQuery).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"},{path:"exam.question.learningStrand"}]).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
    res.json({data: find})
  },
  checkStatus: async (req, res, next) => {
    const find = await Model.find({examiner:req.params.examiner, "status": {$eq: "Pending"}}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
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