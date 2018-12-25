const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const generatedExam = require('../controllers/generated-exam');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/generated-exam')
  .post( generatedExam.add);

router.route('/generated-exam/all')
  .get( generatedExam.fetchAll);

router.route('/generated-exam/:id')
  .get( generatedExam.fetchSingle);

router.route('/generated-exam/update/:id')
  .put( generatedExam.update);

router.route('/generated-exam/delete/:id')
  .delete( generatedExam.delete);

router.route('/generated-exam/check-status/:examiner')
  .get( generatedExam.checkStatus);

module.exports = router;