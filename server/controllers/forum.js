const JWT = require('jsonwebtoken');
const Model = require('../models/forum');
const { JWT_SECRET } = require('../configuration');

module.exports = {
  add: async (req, res, next) => {
    let postData = {
      forum: req.body.forum,
      description: req.body.description,
      title: req.body.title,
      createdBy: req.body.createdBy,
      datePosted: req.body.datePosted,
      description: req.body.description,
      image: req.files.image ? req.files.image[0].filename : null,
    }

    const data = new Model(postData)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {
    const find = await Model.find({}).populate([{path:"forum"},{path:"createdBy"}, {path:"comments.user"}]).exec()
    res.json({data: find})
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"forum"},{path:"createdBy"}, {path:"comments.user"}]).exec()
    res.json({data: find})
  },
  fetchByManagement: async (req, res, next) => {
    const find = await Model.find({ forum: req.params.id}).populate([{path:"forum"},{path:"createdBy"}, {path:"comments.user"}]).exec()
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