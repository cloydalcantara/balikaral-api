const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const level = require('../controllers/level');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/level')
  .post( level.add);

router.route('/level/all')
  .get( level.fetchAll);

router.route('/level/:id')
  .get( level.fetchSingle);

router.route('/level/delete/:id')
  .delete( level.delete);

router.route('/level/update/:id')
  .put( level.update);

module.exports = router;