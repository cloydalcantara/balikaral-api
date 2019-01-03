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
    const count = await Model.find({}).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10 
    const find = await Model.find({}).skip(skip).limit(10).exec()
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
    const find = await Model.findOne({_id:req.params.id}).exec()
    res.json({data: find})
  },
  fetchByManagement: async (req, res, next) => {
    const count =  await Model.find({forum:req.params.id}).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10 
    const find =  await Model.find({forum:req.params.id}).skip(skip).limit(10).exec()
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
    res.json({message: "Deleted!"})
  },
  update: async (req, res, next) => {
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    res.json({data: update})
  }
}