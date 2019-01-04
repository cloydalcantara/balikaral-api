const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const landingpage = require('../controllers/landing-page');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/landing-page')
  .post( landingpage.add);

router.route('/landing-page/all')
  .get( landingpage.fetchAll);

router.route('/landing-page/:id')
  .get( landingpage.fetchSingle);

router.route('/landing-page/update/:id')
  .put( landingpage.update);

module.exports = router;