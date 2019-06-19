const JWT = require('jsonwebtoken');
const Model = require('../models/competency-assignment');
const { JWT_SECRET } = require('../configuration');


module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    if(save){
      res.json({ success: false, data: save });
    }else{
      res.json({ success: false })
    }
  },
  fetchAll: async (req, res, next) => {
   
    const count = await Model.find({}).countDocuments().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find({}).populate([{path:"competency"},{path:"office"}]).skip(skip).limit(10).exec()
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
  fetchWithoutPagination: async (req, res, next) => {
    const find = await Model.find({}).populate([{path:"competency"},{path:"office"}]).exec()
      res.json({
        data: find       
    })
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"competency"},{path:"office"}]).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      res.json({message: "Deleted!"})
    }
    
  },
  update: async (req, res, next) => {
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      res.json({data: update})
    }
  }
}