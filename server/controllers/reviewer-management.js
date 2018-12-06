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
      validationCounter: req.body.validationCounter
    }

    const data = new Model(rmData)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {
    const find = await Model.find({}).exec()
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
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  },
  validate: async (req, res, next) => {
    const data = {
      validation: req.body.validation,
      validationCounter: req.body.validation
    }
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  }
}