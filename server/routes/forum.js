const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const forum = require('../controllers/forum');
const passportJWT = passport.authenticate('jwt', { session: false });
const multer = require('multer')

const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + '.png')
  }
})

const photo = multer({ storage: photostorage })

router.route('/forum')
  .post( photo.fields([{ name: 'image', maxCount: 1 }]), forum.add);

router.route('/forum/all')
  .get( forum.fetchAll);

router.route('/forum/discussions/:id')
  .get( forum.fetchByManagement);

router.route('/forum/:id')
  .get( forum.fetchSingle);

router.route('/forum/delete/:id')
  .delete( forum.delete);

router.route('/forum/update/:id')
  .put( forum.update);

module.exports = router;