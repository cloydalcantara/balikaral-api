const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST', { useMongoClient: true });
} else {
  mongoose.connect('mongodb://localhost/APIAuthentication', { useMongoClient: true });
}

const app = express();
app.use(cors());
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
// Routes
app.use('/balikaral', require('./routes/users'));
app.use('/balikaral', require('./routes/learningStrand'));
app.use('/balikaral', require('./routes/level'));
app.use('/balikaral', require('./routes/exam-management'));
app.use('/balikaral', require('./routes/reviewer-management'));

module.exports = app;
