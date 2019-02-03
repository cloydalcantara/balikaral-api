const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const teacherLearner = require('../controllers/teacher-learner');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/teacher-learner')
  .post( teacherLearner.add);

router.route('/teacher-learner/all')
  .get( teacherLearner.fetchAll);
router.route('/teacher-learner/fetchAllWithoutPagination')
  .get( teacherLearner.fetchWithoutPagination);
router.route('/teacher-learner/:id')
  .get( teacherLearner.fetchSingle);

router.route('/teacher-learner/delete/:id')
  .delete( teacherLearner.delete);

router.route('/teacher-learner/update/:id')
  .put( teacherLearner.update);

module.exports = router;