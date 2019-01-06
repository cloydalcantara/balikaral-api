const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const comment = require('../controllers/comment');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/comment')
  .post( comment.add);

router.route('/comment/all')
  .get( comment.fetchAll);

router.route('/comment/forum/:id')
  .get( comment.fetchByForum);

router.route('/comment/:id')
  .get( comment.fetchSingle);

router.route('/comment/delete/:id')
  .delete( comment.delete);

router.route('/comment/update/:id')
  .put( comment.update);
 
module.exports = router;