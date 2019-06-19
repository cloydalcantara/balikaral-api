const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const schedule = require('../controllers/assessment-schedule');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/schedule')
  .post( schedule.add);

router.route('/schedule/all')
  .get( schedule.fetchAll);
router.route('/schedule/fetchAllWithoutPagination')
  .get( schedule.fetchWithoutPagination);

router.route('/schedule/:id')
  .get( schedule.fetchSingle);

router.route('/schedule/fetch/active')
  .get( schedule.fetchActive);

router.route('/schedule/delete/:id')
  .delete( schedule.delete);

router.route('/schedule/update/:id')
  .put( schedule.update);

module.exports = router;