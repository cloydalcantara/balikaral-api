const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const reviewerManagement = require('../controllers/reviewer-management');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + (req.body.fileType === 'PDF' ? '.pdf' : '') + (req.body.fileType === 'Powerpoint Presentation' ? '.ppt' : '') + (req.body.fileType === 'Microsoft Word Document' ? '.docx' : ''))
  }
})

const upload = multer({ storage: storage }).single('pdf')

router.route('/reviewer-management')
  .post(  upload, reviewerManagement.add );

router.route('/reviewer-management/all')
  .get(  reviewerManagement.fetchAll);

router.route('/reviewer-management/fetchAllWithoutPagination')
  .get(  reviewerManagement.fetchAllWithoutPagination);

router.route('/reviewer-management/:id')
  .get(  reviewerManagement.fetchSingle);

router.route('/reviewer-management/uploaded-count/:id')
  .get( reviewerManagement.getUploadCount);

router.route('/reviewer-management/delete/:id')
  .delete(  reviewerManagement.delete);

router.route('/reviewer-management/update/:id')
  .put(  reviewerManagement.update);

router.route('/reviewer-management/validate/:id')
  .put(  reviewerManagement.validate);

router.route('/reviewer-management/validate-multiple')
  .put(  reviewerManagement.validateMultiple);
module.exports = router;