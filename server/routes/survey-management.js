const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const surveyManagement = require('../controllers/survey-management');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/survey-management')
  .post( surveyManagement.add);

router.route('/survey-management/fetchAllWithoutPagination')
  .get( surveyManagement.fetchWithoutPagination);

router.route('/survey-management/all')
  .get( surveyManagement.fetchAll);
  
router.route('/survey-management/:id')
  .get( surveyManagement.fetchSingle);

router.route('/survey-management/delete/:id')
  .delete( surveyManagement.delete);

router.route('/survey-management/update/:id')
  .put( surveyManagement.update);

module.exports = router;