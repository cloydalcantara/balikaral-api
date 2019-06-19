const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const salaryGrade = require('../controllers/salary-grade');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/salary-grade')
  .post( salaryGrade.add);

router.route('/salary-grade/all')
  .get( salaryGrade.fetchAll);
router.route('/salary-grade/fetchAllWithoutPagination')
  .get( salaryGrade.fetchWithoutPagination);
router.route('/salary-grade/:id')
  .get( salaryGrade.fetchSingle);

router.route('/salary-grade/delete/:id')
  .delete( salaryGrade.delete);

router.route('/salary-grade/update/:id')
  .put( salaryGrade.update);

module.exports = router;