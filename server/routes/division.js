const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const division = require('../controllers/division');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/division')
  .post( division.add);

router.route('/division/all')
  .get( division.fetchAll);
router.route('/division/fetchAllWithoutPagination')
  .get( division.fetchWithoutPagination);
router.route('/division/:id')
  .get( division.fetchSingle);

router.route('/division/delete/:id')
  .delete( division.delete);

router.route('/division/update/:id')
  .put( division.update);

module.exports = router;