const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const office = require('../controllers/office');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/office')
  .post( office.add);

router.route('/office/all')
  .get( office.fetchAll);
router.route('/office/fetchAllWithoutPagination')
  .get( office.fetchWithoutPagination);
router.route('/office/:id')
  .get( office.fetchSingle);

router.route('/office/delete/:id')
  .delete( office.delete);

router.route('/office/update/:id')
  .put( office.update);

module.exports = router;