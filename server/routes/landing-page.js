const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const landingpage = require('../controllers/landing-page');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'csv')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + '.csv')
  }
})

const upload = multer({ storage: storage }).single('csv')

const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + '.png')
  }
})

const photo = multer({ storage: photostorage })

router.route('/landing-page')
  .post( photo.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'pageLogo', maxCount: 1 },
  { name: 'tungkolSaProgramaLogo', maxCount: 1 },
  { name: 'learnerDescriptionImage', maxCount: 1 },
  { name: 'contributorDescriptionImage', maxCount: 1 }

  ]),landingpage.add);

router.route('/landing-page/all')
  .get( landingpage.fetchAll);

router.route('/landing-page/fetch-active')
  .get( landingpage.fetchActive);

router.route('/landing-page/:id')
  .get( landingpage.fetchSingle);

router.route('/landing-page/delete/:id')
  .delete( landingpage.delete);

router.route('/landing-page/update/:id')
  .put(  photo.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'pageLogo', maxCount: 1 },
  { name: 'tungkolSaProgramaLogo', maxCount: 1 },
  { name: 'learnerDescriptionImage', maxCount: 1 },
  { name: 'contributorDescriptionImage', maxCount: 1 }
  ]), landingpage.update);
  
router.route('/landing-page/set-active/:id')
  .put( landingpage.setActive);





module.exports = router;