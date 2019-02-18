const JWT = require('jsonwebtoken');
const Model = require('../models/generated-exam');
const User = require('../models/user')
const SurveyUser = require('../models/survey-user')
const { JWT_SECRET } = require('../configuration');
const AuditTrail = require('../models/auditTrail')


module.exports = {
  add: async (req, res, next) => {
    console.log(req.body)
    const data = new Model(req.body)
    const save = await data.save() 
    if(save){
      const trail = {
        title: "Generate Exam.",
        user: req.query.userId,
        module: "Generate Exam",
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
      if(query.examiner){
        findQuery = {...findQuery, examiner: query.examiner}
      }
      if(query.level){
        findQuery = {...findQuery, level: query.level }
      }
      if(query.type){
        findQuery = {...findQuery, type: query.type }
      }
      if(query.status){
        findQuery = {...findQuery, status: query.status }
      }
    }
    const count = await Model.find(findQuery).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"},{path:"exam.question.learningStrand"},{path:"percentagePerLearningStrand.learningStrand"}]).count().exec()
    const pageCount = Math.ceil(count / 10)
    const skip = (parseInt(req.query.page) - 1) * 10
    const find = await Model.find(findQuery).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"},{path:"exam.question.learningStrand"},{path:"percentagePerLearningStrand.learningStrand"}]).skip(skip).limit(10).exec()
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
  fetchIfHasPreTest: async (req, res, next) => {
    console.log(req.query.level + ' ' + req.query.examiner)
    const preTest = await Model.find({level: req.query.level, examiner: req.query.examiner, type: "Pre Test"}).count().exec()
    console.log(preTest)
    if(preTest > 0){
      res.json({ pretest: true })
    }else{
      res.json({ pretest: false })
    }
  },
  fetchIfHasAdaptiveTest: async (req, res, next) => {
    const adaptiveTest = await Model.find({level: req.query.level, examiner: req.query.examiner, type: "Adaptive Test", status: "Completed" }).count().exec()
    console.log(adaptiveTest)
    if(adaptiveTest > 0){
      res.json({ adaptivetest: true })
    }else{
      res.json({ adaptivetest: false })
    }
  },
  fetchIfHasPostTestAndSurvey: async (req, res, next) => {
    const count = await Model.find({examiner:req.query.examiner, level: {$eq: req.query.level} ,"status": {$eq: "Completed"}, type: {$eq: "Post Test"}}).count().exec()
    
    if(count > 0){
      const countSurvey = await SurveyUser.find({user: req.query.examiner}).count().exec()
      if(countSurvey > 0){
        res.json({surveyStatus: 'Has Survey'})
      }else{
        res.json({surveyStatus: 'Take Survey'})
      }
    }else{
      res.json({surveyStatus: 'Not Yet Available'})
    }
  },
  fetchSingle: async (req, res, next) => {
    const find = await Model.findOne({_id:req.params.id}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
    res.json({data: find})
  },
  fetchAnalyticsOfPassers: async( req, res, next ) => {
    const count = await User.find({"local.userType":req.query.userType}).count().exec() // userType is yung sa Learner
    //fetch natin yung mga nakapasa na. Per examType. Siguro naka donut to. Para ex. 60% passed out of 40% ongoing
    const find = await Model.find({examType:req.query.examType,status:req.query.status}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
    res.json({data: find, totalLearner: count})
  },
  fetchAnalyticsOfPerLearner: async( req, res, next ) => {
    // Display mo sa Pre-Test ay Percentage lang.
    // Display mo sa Adaptive yung Graph. Kung nakailang take. tapos kung pataas ba ang percentage nya.
    // Same sa Adaptive yung sa POST
    const find = await Model.find({examType:req.query.examType,status:req.query.status,examiner: req.query.examiner}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
    res.json({data: find})
  },

  fetchCountOfExamType: async( req, res, next ) => { 
    let completedQuery = {
      examType: req.query.examType,
      status: 'Completed'
    }
    let retakeQuery = {
      examType: req.query.examType,
      status: 'Retake'
    }
    let pendingQuery = {
      examType: req.query.examType,
      status: 'Pending'
    }
    let totalQuery = {
      examType: req.query.examType
    }
    if(req.query.examiner){
      completedQuery = {...completedQuery, examiner: req.query.examiner}
      retakeQuery = {...retakeQuery, examiner: req.query.examiner}
      pendingQuery = {...pendingQuery, examiner: req.query.examiner}
      totalQuery = {...totalQuery, examiner: req.query.examiner}
    }
    

    const completed = await Model.find(completedQuery).count().exec()
    const retake = await Model.find(retakeQuery).count().exec()
    const pending = await Model.find(pendingQuery).count().exec()
    const total = await Model.find(totalQuery).count().exec()

    res.json({completed: completed, retake: retake, pending: pending, total: total})
  },
  

  checkStatus: async (req, res, next) => {
    const find = await Model.find({examiner:req.params.examiner, "status": {$eq: "Pending"}}).populate([{path:"level"},{path:"examType"},{path:"examiner"},{path:"exam.question"}]).exec()
    res.json({data: find})
  },
  delete: async (req, res, next) => {
    const remove = await Model.remove({_id:req.params.id}).exec()
    if(remove){
      const trail = {
        title: "Delete Generated Exam.",
        user: req.query.userId,
        module: "Generate Exam",
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
    const data = req.body
    const update = await Model.findOneAndUpdate({_id:req.params.id},{$set:data}).exec()
    if(update){
      const trail = {
        title: "Update Generated Exam.",
        user: req.query.userId,
        module: "Generate Exam",
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
  statsPreAndPost: async (req, res, next) => {
    // STATISTICS
    // Display Pre and Post. Line graph
    const pre = await Model.find({examiner:req.params.id,type:"Pre Test"}).exec()
    const post = await Model.find({examiner:req.params.id,type:"Post Test"}).exec()
    let preData = []
    let postData = []
    for(let i = 0; i<pre.length; i++){
      preData.push({percentage: (pre[i].score / pre[i].exam.length) * 100, type: "Pre Test"})
    }
    for(let a = 0; a<post.length; a++){
      postData.push({percentage: (post[a].score / post[a].exam.length) * 100, type: "Post Test"})
    }
    res.json({pre: preData, post: postData})
  },
  performanceIndicator: async (req, res, next) => {
    // STATISTICS
    // Display from Pre, Adaptive then post. If post can be highlighted (much better) line graph
    const pre = await Model.find({examiner:req.params.id,type:"Pre Test"}).exec()
    const adaptiveTest = await Model.find({examiner:req.params.id,type:"Adaptive Test"}).exec()
    const post = await Model.find({examiner:req.params.id,type:"Post Test"}).exec()
    let preData = []
    let adaptiveData = []
    let postData = []
    for(let i = 0; i<pre.length; i++){
      preData.push({percentage: (pre[i].score / pre[i].exam.length) * 100, type: "Pre Test"})
    }
    for(let a = 0; a<adaptiveTest.length; a++){
      adaptiveData.push({percentage: (adaptiveTest[a].score / adaptiveTest[a].exam.length) * 100, type: "Adaptive Test"})
    }
    for(let b = 0; b<post.length; b++){
      postData.push({percentage: (post[b].score / post[b].exam.length) * 100, type: "Post Test"})
    }
    res.json({pre: preData, adaptiveTest: adaptiveData, post: postData})
  },
  perAndPostFetchAnalytics: async (req, res, next) => {
    // STATISTICS
    // Display from Pre, Adaptive then post. If post can be highlighted (much better) line graph
    const pre = await Model.find({examiner:req.params.id,type:"Pre Test"}).populate("percentagePerLearningStrand.learningStrand").exec()
    const post = await Model.find({examiner:req.params.id,type:"Post Test"}).populate("percentagePerLearningStrand.learningStrand").exec()
    let datas = []
    console.log(pre[0].percentagePerLearningStrand[1].learningStrand.name)
    for(let i = 0; i <pre[0].percentagePerLearningStrand.length; i++){
      datas.push({learningStrand:pre[0].percentagePerLearningStrand[i].learningStrand.name,percentage:pre[0].percentagePerLearningStrand[i].percentage,type:"Pre Test"})
    }
    for(let a = 0; a <post[0].percentagePerLearningStrand.length; a++){
      datas.push({learningStrand:post[0].percentagePerLearningStrand[a].learningStrand.name,percentage:post[0].percentagePerLearningStrand[a].percentage,type:"Pre Test"})
    }
    function groupBy(xs, f) {
      return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
    const result = groupBy(datas, (c) => c.learningStrand);

    res.json({data: result})
  },
  allExamFetchAnalytics: async (req, res, next) => {
    // STATISTICS
    // Display from Pre, Adaptive then post. If post can be highlighted (much better) line graph
    const pre = await Model.find({examiner:req.params.id,type:"Pre Test"}).populate("percentagePerLearningStrand.learningStrand").exec()
    const adaptive = await Model.find({examiner:req.params.id,type:"Adaptive Test"}).populate("percentagePerLearningStrand.learningStrand").exec()
    const post = await Model.find({examiner:req.params.id,type:"Post Test"}).populate("percentagePerLearningStrand.learningStrand").exec()
    let datas = []
    console.log(pre[0].percentagePerLearningStrand[1].learningStrand.name)
    for(let i = 0; i <pre[0].percentagePerLearningStrand.length; i++){
      datas.push({learningStrand:pre[0].percentagePerLearningStrand[i].learningStrand.name,percentage:pre[0].percentagePerLearningStrand[i].percentage,type:"Pre Test"})
    }
    for(let z = 0; z < adaptive.length; z++) {
      for(let c = 0; c <adaptive[z].percentagePerLearningStrand.length; c++){
        datas.push({learningStrand:adaptive[z].percentagePerLearningStrand[c].learningStrand.name,percentage:adaptive[z].percentagePerLearningStrand[c].percentage,type:"Adaptive Test"})
      }
    }
    for(let a = 0; a <post[0].percentagePerLearningStrand.length; a++){
      datas.push({learningStrand:post[0].percentagePerLearningStrand[a].learningStrand.name,percentage:post[0].percentagePerLearningStrand[a].percentage,type:"Pre Test"})
    }
    function groupBy(xs, f) {
      return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
    const result = groupBy(datas, (c) => c.learningStrand);

    res.json({data: result})
  }
}