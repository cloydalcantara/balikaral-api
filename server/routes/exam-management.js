const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const examManagement = require('../controllers/exam-management');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'csv')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.csv')
  }
})

const upload = multer({ storage: storage }).single('csv')

const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.png')
  }
})

const photo = multer({ storage: photostorage })

router.route('/exam-management')
  .post( photo.fields([{ name: 'questionImage', maxCount: 1 },
    { name: 'aImage', maxCount: 1 },{ name: 'bImage', maxCount: 1 },
    { name: 'cImage', maxCount: 1 },{ name: 'dImage', maxCount: 1 }]), examManagement.add);

router.route('/exam-management/all')
  .get( examManagement.fetchAll);

router.route('/exam-management/generate-random')
  .get( examManagement.generateRandomExam);

router.route('/exam-management/generate-exam')
  .get( examManagement.generateExamination);

router.route('/exam-management/fetch-random-pre-test')
  .get( examManagement.fetchRandomPreTest);

router.route('/exam-management/exam-status')
  .get( examManagement.fetchExamStatus);


router.route('/exam-management/pre-test')
  .get(examManagement.fetchPreTest)

router.route('/exam-management/exercise/:learningStrand')
  .get( examManagement.fetchExerciseExam);

router.route('/exam-management/difficulty-count')
  .get(examManagement.fetchDifficultyCount)

router.route('/exam-management/:id')
  .get( examManagement.fetchSingle);

router.route('/exam-management/delete/:id')
  .delete( examManagement.delete);

router.route('/exam-management/update/:id')
  .put( photo.fields([{ name: 'questionImage', maxCount: 1 },
  { name: 'aImage', maxCount: 1 },{ name: 'bImage', maxCount: 1 },
  { name: 'cImage', maxCount: 1 },{ name: 'dImage', maxCount: 1 }]), examManagement.update);

router.route('/exam-management/csv')
  .post(upload, examManagement.upload);

router.route('/exam-management/validate/:id')
  .put(  examManagement.validate);

router.route('/exam-management/validate-multiple')
  .put(  examManagement.validateMultiple);



module.exports = router;