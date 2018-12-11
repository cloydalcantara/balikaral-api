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
    cb(null, file.originalname + '-' + Date.now() + '.csv')
  }
})

const upload = multer({ storage: storage }).single('csv')

router.route('/exam-management')
  .post(passportJWT, examManagement.add);

router.route('/exam-management/all')
  .get(passportJWT, examManagement.fetchAll);

router.route('/exam-management/:id')
  .get(passportJWT, examManagement.fetchSingle);

router.route('/exam-management/delete/:id')
  .delete(passportJWT, examManagement.delete);

router.route('/exam-management/update/:id')
  .put(passportJWT, examManagement.update);

router.route('/exam-management/csv')
  .post(upload, examManagement.upload);

router.route('/exam-management/validate/:id')
  .put( passportJWT, examManagement.validate);

module.exports = router;