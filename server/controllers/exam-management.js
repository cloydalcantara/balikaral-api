const JWT = require('jsonwebtoken');
const Model = require('../models/exam-management');
const ExamType = require('../models/exam-type-management')
const User = require('../models/user')
const GeneratedExam = require('../models/generated-exam')
const Result = require('../models/examination-result')
const { JWT_SECRET } = require('../configuration');
const csvtojson = require('csvtojson')
const rquery = require('mongoose-query-random')
const AuditTrail = require('../models/auditTrail')
module.exports = {
  add: async (req, res, next) => {
    let addData = {
      level: req.body.level,
      reviewer: req.body.reviewer,
      learningStrand: req.body.learningStrand,
      uploader: req.body.uploader,
      validation: req.body.validation,
      validator: req.body.validator,
       question:{
        details: req.body.questionDetails,
        images: req.files.questionImage ? req.files.questionImage[0].filename : null,
        choices:{
          a:{
            image: req.files.aImage ? req.files.aImage[0].filename : null,
            details: req.body.aDetails
          },
          b:{
            image: req.files.bImage ? req.files.bImage[0].filename : null,
            details: req.body.bDetails
          },
          c:{
            image: req.files.cImage ? req.files.cImage[0].filename : null,
            details: req.body.cDetails
          },
          d:{
            image: req.files.dImage ? req.files.dImage[0].filename : null,
            details: req.body.dDetails
          },
          
        },
        answer: req.body.answer,
        difficulty: req.body.difficulty
      },
      
    }

    if(req.body.learningStrandSub){
      addData = { ...addData, learningStrandSub: req.body.learningStrandSub }
    }
    if(req.body.validator){
      addData = { ...addData, validator: [ { user: req.body.validator} ] }
    }

    const data = new Model(addData)
    const save = await data.save() 
  
    if(save){
      let trail = {
        title: "Insert Question/s!",
        user: req.query.userId,
        module: "Exam Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      

      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({ data: save });
    }
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
      if(query.learningStrandSub){
        findQuery = {...findQuery, learningStrandSub: query.learningStrandSub }
      }
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
      if(query.reviewer){
        findQuery = {...findQuery, reviewer: query.reviewer }
      }
    }

    
    const count = await Model.find(findQuery).populate([{path:"level"},{path:"learningStrand"},{path:"reviewer"},{path:"learningStrandSub"},{path:"uploader"},{path:"validator.user"}]).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find(findQuery).populate([{path:"level"},{path:"learningStrand"},{path:"reviewer"},{path:"learningStrandSub"},{path:"uploader"},{path:"validator.user"}]).skip(skip).limit(10).exec()
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
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"level"},{path:"reviewer"},{path:"learningStrand"},{path:"learningStrandSub"},{path:"uploader"},{path:"validator.user"}]).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      const trail = {
        title: "Delete Question/s!",
        user: req.query.userId,
        module: "Exam Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({message: "Deleted!"})
    }
    
  },
  update: async (req, res, next) => {
    let updateData = {
      level: req.body.level,
      reviewer: req.body.reviewer,
      learningStrand: req.body.learningStrand,
      uploader: req.body.uploader,
      validation: req.body.validation,
       question:{
        details: req.body.questionDetails,
        images: req.files.questionImage ? req.files.questionImage[0].filename : req.body.questionImageText,
        choices:{
          a:{
            image: req.files.aImage ? req.files.aImage[0].filename : req.body.aImageText,
            details: req.body.aDetails
          },
          b:{
            image: req.files.bImage ? req.files.bImage[0].filename : req.body.bImageText,
            details: req.body.bDetails
          },
          c:{
            image: req.files.cImage ? req.files.cImage[0].filename : req.body.cImageText,
            details: req.body.cDetails
          },
          d:{
            image: req.files.dImage ? req.files.dImage[0].filename : req.body.dImageText,
            details: req.body.dDetails
          },
          
        },
        answer: req.body.answer,
        difficulty: req.body.difficulty
      }
    }

    if(req.body.learningStrandSub){
      updateData = { ...updateData, learningStrandSub: req.body.learningStrandSub }
    }

    const data = updateData
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      const trail = {
        title: "Edit Question/s!",
        user: req.query.userId,
        module: "Exam Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
    
  },
  validate: async (req, res, next) => {
    const data = {
      validator: req.body.validator,
      validation: req.body.validation
    }
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      const trail = {
        title: "Validate Question.",
        user: req.query.userId,
        module: "Exam Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner,
        date: Date.now()
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
  },
  validateMultiple: async (req, res, next) => {
  
    const update = await Model.updateMany({_id:{$in:[...req.body.id]}},{$set:{validation: true, validator: req.body.validator }}).exec()
    if(update){
      const trail = {
        title: "Validate Questions.",
        user: req.query.userId,
        module: "Exam Management",
        validator: req.query.validator,
        contributor: req.query.contributor,
        learner  : req.query.learner
      }
      const trailData = new AuditTrail(trail)
      await trailData.save()
      res.json({data: update})
    }
    
  },


  fetchExam: async( req, res, next ) => {
    // const fetchExamType = await ExamType.findOne({_id: req.query.examId}).populate({path:"level"}).exec()

    // const checkexamResult = await GeneratedExam.find({ examiner:req.query.examinerId, status: 'Completed', type: req.query.type, }).exec()

    // const examResult = await GeneratedExam.find({ examiner:req.query.examinerId, status: 'Retake', type: req.query.type}).exec()

    // const fetchExamType = await ExamType.findOne({ _id: req.query.examId}).populate({path:"level"}).exec()


   
    
    // const checkIfAdaptiveTestHasPassed = await GeneratedExam.find({ examiner:req.query.examinerId, status: 'Completed', examType: adaptiveExamType[0]._id }).exec()
    
    // let learningStrandId = []

    // if(req.query.type === 'Post Test' && checkIfAdaptiveTestHasPassed.length === 0){
    //   res.json({ status: 'Take Adaptive Test' })
    // }

    // if(checkexamResult.length == 1){
    //   res.json({status: 'Passed'})
    // }
    
    // if(examResult.length > 0){//retake
      //fetch learningStrandId from generatedExam.percentagePerLearningStrand
    //   let failedLearningStrand = examResult[examResult.length - 1].percentagePerLearningStrand.filter((attr)=>{
    //     return attr.percentage < 90
    //   })
    //   failedLearningStrand.map((attr)=>{
    //     learningStrandId = [...learningStrandId, attr.learningStrand]
    //   })
    // }else{//new exam
    //   fetchExamType.learningStrandQuestions.map((attr)=>{
    //     learningStrandId = [...learningStrandId, attr.learningStrand]
    //   })
    // }

    // const easyCount = await Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{$eq:"Easy" } }).count().exec()
    // const averageCount = await Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{$eq:"Average" } }).count().exec()
    // const difficultCount = await Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{$eq:"Difficult" } }).count().exec()

    // console.log(easyCount + ', ' + averageCount + ', ' + difficultCount)

    // // if(easyCount <= fetchExamType.easy && averageCount <= fetchExamType.average && difficultCount <= fetchExamType.difficult){
    //   await Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{$eq:"Easy" } }).random(fetchExamType.easy, true, function(err, data) {
    //     if (err) throw err;
    //     const easy = data
    //     Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{ $eq:"Average" } }).random(fetchExamType.average,true, function(err, data){
    //       if (err) throw err;
    //       const average = data
    //       Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{ $eq:"Difficult" } }).random(fetchExamType.difficult, true, function(err, data){
    //         if (err) throw err;
    //         const difficult = data
    //         res.json({easy: easy, average: average, difficult:difficult, examType:fetchExamType, status: 'Taking'})
    //       })
    //     })
    //   });
    // }else{
    //   res.json({status: 'Not Enough Number of Question'})
    // }

    
  },
  
  fetchPreTest: async ( req, res, next ) => {
    console.log(req.query.level)
    let countPreTest = await ExamType.find({examType: {$eq: 'Pre Test'}, "level": {$eq: req.query.level} }).count().exec()
    console.log(countPreTest)
    if(countPreTest > 0){
      await ExamType.find({examType: {$eq: 'Pre Test'}, "level": {$eq: req.query.level} }).populate({path:"level"}).random(1, true, function(err, data) {
        if (err) throw err;
        let fetchExamType = data[0]
        let learningStrandId = []
        fetchExamType.learningStrandQuestions.map((attr)=>{
          learningStrandId = [...learningStrandId, {learningStrand: attr.learningStrand, easy: attr.easy, average: attr.average,  difficult: attr.difficult, }]
        })

        
        

        
            let easyCount = []
            let averageCount = []
            let difficultCount = []
            let ls = learningStrandId.map((attr, index)=>{
              return new Promise(function(resolve, reject){
                Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Easy" } }).random(attr.easy, true, function(err, data) {
                  if (err) throw err;
                  const easy = data
                  Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Average" } }).random(attr.average, true, function(err, data) {
                      if (err) throw err;
                      const average = data
                      Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Difficult" } }).random(attr.difficult, true, function(err, data) {
                        if (err) throw err;
                        const difficult = data
                        resolve({easy: easy, average: average, difficult: difficult})
                    })
                  })
                })
              })
                .then((response)=>{
                  console.log(response)
                })
                .catch((err)=>{
                  console.log(err)
                })
              
            })
            console.log(ls)
            
       
        

        

          

        //  learningStrandId.map((attr)=>{
        //     new Promise(function(res, rej){
        //         Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Easy" } }).random(attr.easy, true, function(err, data) {
        //           if (err) throw err;
        //           res(data)
        //         })
        //     })
        //       .then((res)=>{
        //         console.log('res',res)
        //         easy = [...easy, ...res]

        //       })
        //       .catch((err)=>{
        //         console.log('err',err)
        //       })
        // })
        // learningStrandId.map((attr)=>{
          
          // Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Easy" } }).random(attr.easy, true, function(err, data) {
          //   if (err) throw err;
          //   console.log('d', data)
          //   easy = [...easy, ...data]
          //   console.log('eas',easy)
          // })
          
          // Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Average" } }).random(attr.average, true, function(err, data) {
          //   if (err) throw err;
          //   average = [...average, ...data]
          // })
          // Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$eq: attr.learningStrand}, "question.difficulty":{$eq:"Difficult" } }).random(attr.difficult, true, function(err, data) {
          //   if (err) throw err;
          //   difficult = [...difficult, ...data]
          // })
        // })
        // console.log('after map ', easy)
        // res.json({
        //   easy: easy, 
        //   average: average, 
        //   difficult:difficult, 
        //   examType:fetchExamType
        // })


        
          // Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{$eq:"Easy" } }).random(fetchExamType.easy, true, function(err, data) {
          //   if (err) throw err;
          //   const easy = data
          //   Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{ $eq:"Average" } }).random(fetchExamType.average,true, function(err, data){
          //     if (err) throw err;
          //     const average = data
          //     Model.find({ "level": {$eq: fetchExamType.level}, validation: {$eq: true}, learningStrand: {$in: [...learningStrandId]}, "question.difficulty":{ $eq:"Difficult" } }).random(fetchExamType.difficult, true, function(err, data){
          //       if (err) throw err;
          //       const difficult = data
          //       res.json({easy: easy, average: average, difficult:difficult, examType:fetchExamType})
          //     })
          //   })
          // });
        
        
      })
    }else{
      res.json({status: 'No pre test available for your level'})
    }
    
  },

  generateRandomExam: async( req, res, next ) => {
    Model.find({ "level": {$eq: req.query.level}, validation: {$eq: true}, learningStrand: {$eq: req.query.learningStrand}, "question.difficulty":{$eq:"Easy" } }).random(req.query.easy, true, function(err, data) {
      if (err) throw err;
      const easy = data
      Model.find({ "level": {$eq: req.query.level}, validation: {$eq: true}, learningStrand: {$eq: req.query.learningStrand}, "question.difficulty":{ $eq:"Average" } }).random(req.query.average,true, function(err, data){
        if (err) throw err;
        const average = data
        Model.find({ "level": {$eq: req.query.level}, validation: {$eq: true}, learningStrand: {$eq: req.query.learningStrand}, "question.difficulty":{ $eq:"Difficult" } }).random(req.query.difficult, true, function(err, data){
          if (err) throw err;
          const difficult = data
          res.json({easy: easy, average: average, difficult:difficult })
        })
      })
    });
  },
  fetchRandomPreTest: async( req, res, next ) => {
      let countPreTest = await ExamType.find({examType: {$eq: 'Pre Test'}, "level": {$eq: req.query.level} }).count().exec()  
      if(countPreTest > 0){
        ExamType.find({
          "examType": {$eq: 'Pre Test'}, 
          "level": {$eq: req.query.level} }).random(1, true, function(err, data) {
          if (err) throw err;
          res.json({preTest: data[0]})
        })
      }else{  
        res.json({status: 'No pre test available for your level'})
      } 
  }, 
  fetchExamStatus: async(req,res,next) => {
    const checkIfPassed = await GeneratedExam.find({ examiner:req.query.examinerId, status: 'Completed', type: req.query.type, }).count().exec()
    const checkIfFailed = await GeneratedExam.find({ examiner:req.query.examinerId, status: 'Retake', type: req.query.type}).exec()
    console.log(checkIfPassed)
    console.log(checkIfFailed)
    if(checkIfPassed > 0){
      res.json({ status: 'Passed' })
    }else if(checkIfFailed.length > 0){
      let learningStrandId = []
      let failedLearningStrand = checkIfFailed[checkIfFailed.length - 1].percentagePerLearningStrand.filter((attr)=>{
        return attr.percentage < 90
      })
      failedLearningStrand.map((attr)=>{
        learningStrandId = [...learningStrandId, attr.learningStrand]
      })
      res.json({ failedLearningStrand: learningStrandId})
    }else{
      res.json({ status: 'Exam Available' })
    }
    
  },

  fetchExerciseExam: async( req, res, next ) => {
    const checkIfHasExam = await Model.find({ learningStrand:req.params.learningStrand }).count().exec()
    if(checkIfHasExam > 0){
      Model.find({ learningStrand:req.params.learningStrand }).random(1, true, function(err, data){
        if (err) throw err;
        res.json({ data: data });
      })
    }else{
        res.json({ data: false });
    }
    
  },
  fetchDifficultyCount: async( req, res, next ) => {
    let findQuery = {
      validation: {$eq: true}
    }
    if(req.query){
      let query = req.query
      if(query.level){
        findQuery = {...findQuery, level: query.level}
      }
      if(query.learningStrand){
        findQuery = {...findQuery, learningStrand: query.learningStrand }
      }
    }
  
    let easyCountQuery = {...findQuery, "question.difficulty":{ $eq:"Easy" }}
    let averageCountQuery = {...findQuery, "question.difficulty":{ $eq:"Average" }}
    let difficultCountQuery = {...findQuery, "question.difficulty":{ $eq:"Difficult" }}
    const easy = await Model.find(easyCountQuery).count().exec()
    const average = await Model.find(averageCountQuery).count().exec()
    const difficult = await Model.find(difficultCountQuery).count().exec()

    res.json({easy: easy, average: average, difficult: difficult})
  },
  upload: async( req, res, next ) => {
    await csvtojson()
      .fromFile("csv/"+req.file.filename)
      .then((jsonObj)=>{
        
        jsonObj.forEach(element => {
          let data = {
            level : req.body.level,
            reviewer : req.body.reviewer,
            learningStrand : req.body.learningStrand,
            uploader: req.body.uploader,
            validation: req.body.validation,
            question:{
              details : element['Exam Question'],
              choices:{
                a:{
                  details: element['Option - A']
                },
                b:{
                  details: element['Option - B']
                },
                c:{
                  details: element['Option - C']
                },
                d:{
                  details: element['Option - D']
                }
              },
              answer: element['Answer'],
              difficulty: element.Difficulty
            }
          }
        if(req.body.learningStrandSub){
            data = { ...data, learningStrandSub: req.body.learningStrandSub }
          }
        if(req.body.validator){
          data = { ...data, validator: [ { user: req.body.validator} ] }
        }
 

          const finalData = new Model(data)
          const insert = finalData.save()

         
          // if(insert){
          //    const trail = {
          //       title: "Upload Question/s!",
          //       user: req.query.userId,
          //       module: "Exam Management",
          //       validator: req.query.validator,
          //       contributor: req.query.contributor,
          //       learner  : req.query.learner
          //     }
          //     const trailData = new AuditTrail(trail)
          //     trailData.save()
          //     res.json({data:"Inserted!"})
          // }
         

        });

        
        
        
      })
      res.json({data: 'Insert'})
  }

}