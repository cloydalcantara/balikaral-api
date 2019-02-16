const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST', { useNewUrlParser: true, useCreateIndex: true });
} else {
  mongoose.connect('mongodb://localhost/APIAuthentication', { useNewUrlParser: true, useCreateIndex: true });
}

const app = express();
app.use(cors());
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

//app.use(express.static('uploads'))
app.use('/api', express.static('uploads'));
app.use(bodyParser.json());
// Routes
app.use('/api/balikaral', require('./routes/users'));
app.use('/api/balikaral', require('./routes/learningStrand'));
app.use('/api/balikaral', require('./routes/level'));
app.use('/api/balikaral', require('./routes/exam-management'));
app.use('/api/balikaral', require('./routes/exam-type-management'));
app.use('/api/balikaral', require('./routes/reviewer-management'));
app.use('/api/balikaral', require('./routes/generated-exam'));
app.use('/api/balikaral', require('./routes/learningStrandSub'));
app.use('/api/balikaral', require('./routes/forum'));
app.use('/api/balikaral', require('./routes/comment'));
app.use('/api/balikaral', require('./routes/management-forum'));
app.use('/api/balikaral', require('./routes/examination-result'));
app.use('/api/balikaral', require('./routes/session-guide-management'));
app.use('/api/balikaral', require('./routes/survey-management'));
app.use('/api/balikaral', require('./routes/survey-user'));
app.use('/api/balikaral', require('./routes/landing-page'));
app.use('/api/balikaral', require('./routes/auditTrail'));
app.use('/api/balikaral', require('./routes/site-instruction'));
app.use('/api/balikaral', require('./routes/teacher-learner'));

module.exports = app;
