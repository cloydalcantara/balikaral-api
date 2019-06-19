const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '.png')
  }
})

const upload = multer({ storage: storage }).single('image')

router.route('/signup')
  .post( UsersController.signUp);

router.route('/signin')
  .post( passportSignIn, UsersController.signIn);

router.route('/user/all')
  .get( UsersController.fetchAll);

router.route('/user/fetch-all')
  .get( UsersController.fetchAllWithoutPagination);

router.route('/user/update/:id')
  .put( UsersController.update);

router.route('/user/assessment/:id')
  .put( UsersController.assessment);

router.route('/user/:id')
  .get( UsersController.fetchSingle);

router.route('/user/table/:id')
  .get( UsersController.fetchTab);

router.route('/user/delete/:id')
  .delete( UsersController.delete);

module.exports = router;