const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const CRUD = require('../controllers/competency-assignment');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/competency-assignment/insert')
  .post( CRUD.add);

router.route('/competency-assignment/all')
  .get( CRUD.fetchAll);
router.route('/competency-assignment/fetchAllWithoutPagination')
  .get( CRUD.fetchWithoutPagination);
router.route('/competency-assignment/:id')
  .get( CRUD.fetchSingle);

router.route('/competency-assignment/delete/:id')
  .delete( CRUD.delete);

router.route('/competency-assignment/update/:id')
  .put( CRUD.update);

module.exports = router;