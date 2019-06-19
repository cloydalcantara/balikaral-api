const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const assessment = require('../controllers/assessment');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/assessment')
  .post( assessment.add);

router.route('/assessment/all')
  .get( assessment.fetchAll);
router.route('/assessment/fetchAllWithoutPagination')
  .get( assessment.fetchWithoutPagination);
  
router.route('/assessment/:id')
  .get( assessment.fetchSingle);

router.route('/assessment/delete/:id')
  .delete( assessment.delete);

router.route('/assessment/update/:id')
  .put( assessment.update);

module.exports = router;