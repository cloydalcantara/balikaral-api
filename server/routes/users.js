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

router.route('/signup-facebook')
  .post( UsersController.signUpFacebook);

router.route('/signup-google')
  .post( UsersController.signUpGoogle);

router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.route('/oauth/google')
  .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);

router.route('/secret')
  .get(passportJWT, UsersController.secret);

router.route('/user/all')
  .get( UsersController.fetchAll);

router.route('/user/fetch-all')
  .get( UsersController.fetchAllWithoutPagination);

  


router.route('/user/check-email')
  .get( UsersController.checkIfEmailExist);


router.route('/user/check-profile/:id')
  .get( UsersController.fetchToEdit);

router.route('/user/age')
  .get( UsersController.ageCount);

router.route('/user/region')
  .get( UsersController.regionCount);

router.route('/user/occupation')
  .get( UsersController.occupationCount);

router.route('/user/gender')
  .get( UsersController.genderCount);

router.route('/user/years-in-als')
  .get( UsersController.yearsInAlsCount);

router.route('/user/registered-examinee')
  .get( UsersController.registeredExamineeCount);

router.route('/user/let-passer')
  .get( UsersController.letPasserCount);

router.route('/user/no-of-years-teaching')
  .get( UsersController.noOfYearsTeachingCount);

router.route('/user/no-of-years-as-als-teacher')
  .get( UsersController.noOfYearsAsAlsTeacherCount);

router.route('/user/subject-expertise')
  .get( UsersController.subjectExpertiseCount);

router.route('/user/:id')
  .get( UsersController.fetchSingle);

router.route('/users/fetch-learner')
  .get( UsersController.fetchLearner );

router.route('/user/update-personal-info/:id')
  .put( UsersController.updatePersonalInfo);

router.route('/user/update-account-info/:id')
  .put( UsersController.updateAccountInfo);

router.route('/user/update-social-info/:id')
  .put( UsersController.updateSocialInfo);

router.route('/user/disable/:id')
  .put( UsersController.disable);

router.route('/user/update-profile-picture/:id')
  .put( upload, UsersController.updatePicture);

router.route('/user/delete/:id')
  .delete( UsersController.delete);

module.exports = router;