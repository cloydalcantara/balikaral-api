const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const announcements = require('../controllers/announcements');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/announcements')
  .post( announcements.add);

router.route('/announcements/all')
  .get( announcements.fetchAll);
router.route('/announcements/fetchAllWithoutPagination')
  .get( announcements.fetchWithoutPagination);
router.route('/announcements/:id')
  .get( announcements.fetchSingle);

router.route('/announcements/delete/:id')
  .delete( announcements.delete);

router.route('/announcements/update/:id')
  .put( announcements.update);

module.exports = router;