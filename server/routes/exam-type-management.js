const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const examTypeManagement = require('../controllers/exam-type-management');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/exam-type-management')
  .post( examTypeManagement.add);

router.route('/exam-type-management/all')
  .get( examTypeManagement.fetchAll);

router.route('/exam-type-management/:id')
  .get( examTypeManagement.fetchSingle);

router.route('/exam-type-management/delete/:id')
  .delete( examTypeManagement.delete);

router.route('/exam-type-management/update/:id')
  .put( examTypeManagement.update);

module.exports = router;