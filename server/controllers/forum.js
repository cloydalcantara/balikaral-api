const JWT = require('jsonwebtoken');
const Model = require('../models/forum');
const { JWT_SECRET } = require('../configuration');

module.exports = {
  add: async (req, res, next) => {
    let postData = {
      forum: req.body.forum,
      description: req.body.description,
      initial_post: {
        title: req.body.title,
        description: req.body.description,
        image: req.files.image[0].filename
      }
    }

    const data = new Model(postData)
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
  }
}