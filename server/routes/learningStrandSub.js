const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const learningStrandSub = require('../controllers/learningStrandSub');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/learning-strand-sub')
  .post(passportJWT, learningStrandSub.add);

router.route('/learning-strand-sub/all')
  .get(passportJWT, learningStrandSub.fetchAll);

router.route('/learning-strand-sub/:id')
  .get(passportJWT, learningStrandSub.fetchSingle);

router.route('/learning-strand-sub/delete/:id')
  .delete(passportJWT, learningStrandSub.delete);

router.route('/learning-strand-sub/update/:id')
  .put(passportJWT, learningStrandSub.update);

module.exports = router;