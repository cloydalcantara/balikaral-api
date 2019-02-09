const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const SiteInstruction = require('../controllers/site-instruction');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer')

const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '.png')
  }
})

const photo = multer({ storage: photostorage })

router.route('/site-instruction')
  .post( photo.fields([{ name: 'image', maxCount: 1 }]), SiteInstruction.add);

router.route('/site-instruction/all')
  .get( SiteInstruction.fetchAll);

router.route('/site-instruction/fetchAllWithoutPagination')
  .get( SiteInstruction.fetchWithoutPagination);

router.route('/site-instruction/:id')
  .get( SiteInstruction.fetchSingle);

router.route('/site-instruction/delete/:id')
  .delete( SiteInstruction.delete);

router.route('/site-instruction/update/:id')
  .put( photo.fields([{ name: 'image', maxCount: 1 }]), SiteInstruction.update);

module.exports = router;