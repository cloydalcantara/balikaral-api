const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const competencyframework = require('../controllers/competency-framework');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/competency-framework')
  .post( competencyframework.add);

router.route('/competency-framework/all')
  .get( competencyframework.fetchAll);
router.route('/competency-framework/fetchAllWithoutPagination')
  .get( competencyframework.fetchWithoutPagination);

router.route('/competency-framework/type')
  .get( competencyframework.fetchType);
  
router.route('/competency-framework/:id')
  .get( competencyframework.fetchSingle);

router.route('/competency-framework/delete/:id')
  .delete( competencyframework.delete);

router.route('/competency-framework/update/:id')
  .put( competencyframework.update);

module.exports = router;