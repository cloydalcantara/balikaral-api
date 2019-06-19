const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const plantilla = require('../controllers/plantilla');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/plantilla')
  .post( plantilla.add);

router.route('/plantilla/all')
  .get( plantilla.fetchAll);
router.route('/plantilla/fetchAllWithoutPagination')
  .get( plantilla.fetchWithoutPagination);

router.route('/plantilla/:id')
  .get( plantilla.fetchSingle);

router.route('/plantilla/fetch/:id')
  .get( plantilla.fetchQ);

router.route('/plantilla/delete/:id')
  .delete( plantilla.delete);

router.route('/plantilla/update/:id')
  .put( plantilla.update);

module.exports = router;