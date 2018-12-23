const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const managementForum = require('../controllers/management-forum');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/management-forum')
  .post(passportJWT, managementForum.add);

router.route('/management-forum/all')
  .get(passportJWT, managementForum.fetchAll);

router.route('/management-forum/:id')
  .get(passportJWT, managementForum.fetchSingle);

router.route('/management-forum/delete/:id')
  .delete(passportJWT, managementForum.delete);

router.route('/management-forum/update/:id')
  .put(passportJWT, managementForum.update);

module.exports = router;