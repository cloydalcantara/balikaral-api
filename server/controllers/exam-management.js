const JWT = require('jsonwebtoken');
const Model = require('../models/exam-management');
const { JWT_SECRET } = require('../configuration');
const csvtojson = require('csvtojson')

module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    
    res.json({ data: save });
  },
  fetchAll: async (req, res, next) => {
   const find = await Model.find({}).populate([{path:"level"},{path:"learningStrand"}]).exec()
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
  upload: async( req, res, next ) => {
    console.log(req.file)
    await csvtojson()
      .fromFile("csv/"+req.file.filename)
      .then((jsonObj)=>{
        
        jsonObj.forEach(element => {
          console.log(element)
          let data = {
            level : req.body.level,
            learningStrand : req.body.learningStrand,
            question:{
              details : element.details,
              images : element.images,
              choices:{
                a:{
                  type : element.atype,
                  details: element.adetails
                },
                b:{
                  type : element.btype,
                  details: element.bdetails
                },
                c:{
                  type : element.ctype,
                  details: element.cdetails
                },
                d:{
                  type : element.dtype,
                  details: element.ddetails
                }
              },
              answer: element.answer,
              difficulty: element.difficulty
            }
          }
          const finalData = new Model(data)
          const insert = finalData.save()
        });

        res.json({data:"Inserted!"})
      })
  }
}