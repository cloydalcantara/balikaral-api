const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const validation = require('../controllers/validation');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/validation')
  .post( validation.add);

router.route('/validation')
  .get( validation.fetchValidated )

router.route('/validation/fetch')
  .get( validation.fetchValidation )

module.exports = router;