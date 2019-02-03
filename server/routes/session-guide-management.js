const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const sessionGuide = require('../controllers/session-guide-management');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '.pdf')
  }
})

const upload = multer({ storage: storage }).single('pdf')

router.route('/session-guide-management')
  .post(  upload, sessionGuide.add );

router.route('/session-guide-management/all')
  .get(  sessionGuide.fetchAll);

router.route('/session-guide-management/:id')
  .get(  sessionGuide.fetchSingle);

router.route('/session-guide-management/delete/:id')
  .delete(  sessionGuide.delete);

router.route('/session-guide-management/update/:id')
  .put(  sessionGuide.update);

router.route('/session-guide-management/validate/:id')
  .put(  sessionGuide.validate);

router.route('/session-guide-management/validate-multiple')
  .put(  sessionGuide.validateMultiple);
module.exports = router;