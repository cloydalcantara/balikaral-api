const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST');
} else {
  mongoose.connect('mongodb://localhost/APIAuthentication');
}

const app = express();
app.use(cors());
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

app.use(express.static('uploads'))
app.use(bodyParser.json());
// Routes
app.use('/balikaral', require('./routes/users'));
app.use('/balikaral', require('./routes/learningStrand'));
app.use('/balikaral', require('./routes/level'));
app.use('/balikaral', require('./routes/exam-management'));
app.use('/balikaral', require('./routes/exam-type-management'));
app.use('/balikaral', require('./routes/reviewer-management'));
app.use('/balikaral', require('./routes/generated-exam'));
app.use('/balikaral', require('./routes/learningStrandSub'));
app.use('/balikaral', require('./routes/forum'));
app.use('/balikaral', require('./routes/management-forum'));
app.use('/balikaral', require('./routes/examination-result'));

module.exports = app;
