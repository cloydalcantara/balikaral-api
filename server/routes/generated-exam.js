const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const generatedExam = require('../controllers/generated-exam');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/generated-exam')
  .post(passportJWT, generatedExam.add);

router.route('/generated-exam/all')
  .get(passportJWT, generatedExam.fetchAll);

router.route('/generated-exam/:id')
  .get(passportJWT, generatedExam.fetchSingle);

router.route('/generated-exam/delete/:id')
  .delete(passportJWT, generatedExam.delete);

router.route('/generated-exam/update/:id')
  .put(passportJWT, generatedExam.update);

module.exports = router;