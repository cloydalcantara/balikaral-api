const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const practiceExamination = require('../controllers/practice-examination');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/practice-examination')
  .post( practiceExamination.add);

router.route('/practice-examination')
  .get( practiceExamination.fetchValidated )

router.route('/practice-examination/fetch')
  .get( practiceExamination.fetchValidation )

module.exports = router;