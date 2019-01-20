const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const surveyUser = require('../controllers/survey-user');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/survey-user')
  .post( surveyUser.add);

router.route('/survey-user/all')
  .get( surveyUser.fetchAll);
router.route('/survey-user/fetchAllWithoutPagination')
  .get( surveyUser.fetchWithoutPagination);
router.route('/survey-user/:id')
  .get( surveyUser.fetchSingle);

router.route('/survey-user/delete/:id')
  .delete( surveyUser.delete);

router.route('/survey-user/update/:id')
  .put( surveyUser.update);

module.exports = router;