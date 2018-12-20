const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const level = require('../controllers/level');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/level')
  .post(passportJWT, level.add);

router.route('/level/all')
  .get(passportJWT, level.fetchAll);

router.route('/level/:id')
  .get(passportJWT, level.fetchSingle);

router.route('/level/delete/:id')
  .delete(passportJWT, level.delete);

router.route('/level/update/:id')
  .put(passportJWT, level.update);

module.exports = router;