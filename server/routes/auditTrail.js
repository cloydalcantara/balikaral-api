const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const auditTrail = require('../controllers/auditTrail');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/audit-trail')
  .post( auditTrail.add);

router.route('/audit-trail/all')
  .get( auditTrail.fetchAll);
router.route('/audit-trail/fetchAllWithoutPagination')
  .get( auditTrail.fetchWithoutPagination);
router.route('/audit-trail/:id')
  .get( auditTrail.fetchSingle);

router.route('/audit-trail/delete/:id')
  .delete( auditTrail.delete);

router.route('/audit-trail/update/:id')
  .put( auditTrail.update);

module.exports = router;