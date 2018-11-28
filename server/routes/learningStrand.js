const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const LearningStrandController = require('../controllers/learningStrand');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/learning-strand')
  .post(passportJWT, LearningStrandController.add);

router.route('/learning-strand/all')
  .get(passportJWT, LearningStrandController.fetchAll);

router.route('/learning-strand/:id')
  .get(passportJWT, LearningStrandController.fetchSingle);

module.exports = router;