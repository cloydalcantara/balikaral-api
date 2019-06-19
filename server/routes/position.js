const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const position = require('../controllers/position');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/position')
  .post( position.add);

router.route('/position/all')
  .get( position.fetchAll);
router.route('/position/fetchAllWithoutPagination')
  .get( position.fetchWithoutPagination);
router.route('/position/:id')
  .get( position.fetchSingle);

router.route('/position/delete/:id')
  .delete( position.delete);

router.route('/position/update/:id')
  .put( position.update);

module.exports = router;