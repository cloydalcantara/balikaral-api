const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const positionprofile = require('../controllers/position-profile');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/position-profile/insert')
  .post( positionprofile.add);

router.route('/position-profile/all')
  .get( positionprofile.fetchAll);

router.route('/position-profile/fetchAllWithoutPagination')
  .get( positionprofile.fetchWithoutPagination);

router.route('/position-profile/fetch-single')
  .get( positionprofile.fetchSingle);

router.route('/position-profile/fetch-exam/:id')
  .get( positionprofile.fetchExam);

router.route('/position-profile/delete/:id')
  .delete( positionprofile.delete);

router.route('/position-profile/update/:id')
  .put( positionprofile.update);

module.exports = router;