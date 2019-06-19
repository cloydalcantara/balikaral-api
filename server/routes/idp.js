const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const idp = require('../controllers/idp');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/idp')
  .post( idp.add);

router.route('/idp/all')
  .get( idp.fetchAll);
router.route('/idp/fetchAllWithoutPagination')
  .get( idp.fetchWithoutPagination);
router.route('/idp/:id')
  .get( idp.fetchSingle);

router.route('/idp/delete/:id')
  .delete( idp.delete);

router.route('/idp/update/:id')
  .put( idp.update);

module.exports = router;