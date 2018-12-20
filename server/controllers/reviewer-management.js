const JWT = require('jsonwebtoken');
const Model = require('../models/reviewer-management');
const { JWT_SECRET } = require('../configuration');

module.exports = {
  add: async (req, res, next) => {
    let rmData = {
      learningStrand: req.body.learningStrand,
      pdf: req.file.filename,
      description: req.body.description,
      uploader: req.body.uploader,
      validation: req.body.validation,
    }

    const data = new Model(rmData)
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
      if(query.learningStrand){
        findQuery = {...findQuery, learningStrand: query.learningStrand }
      }
    }
    const find = await Model.find(findQuery).populate([{path:"uploader"},{path:"learningStrand"}]).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"uploader"},{path:"learningStrand"},{path:"validator.user"}]).exec()
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
  },
  validate: async (req, res, next) => {
    const data = {
      validator: req.body.validator,
      validation: req.body.validation
    }
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  }
}