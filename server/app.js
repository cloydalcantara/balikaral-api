const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/oca', { useNewUrlParser: true, useCreateIndex: true });
} else {
  mongoose.connect('mongodb://localhost/oca', { useNewUrlParser: true, useCreateIndex: true });
}

const app = express();
app.use(cors());
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({limit: '50mb'}));
//app.use(express.static('uploads'))
app.use('/api', express.static('uploads'));
app.use(bodyParser.json());
// Routes
app.use('/api/oca', require('./routes/users'));
app.use('/api/oca', require('./routes/office'));
app.use('/api/oca', require('./routes/division'));
app.use('/api/oca', require('./routes/position'));
app.use('/api/oca', require('./routes/salary-grade'));
app.use('/api/oca', require('./routes/plantilla'));
app.use('/api/oca', require('./routes/competency-framework'));
app.use('/api/oca', require('./routes/position-profile'));
app.use('/api/oca', require('./routes/assessment-schedule'));
app.use('/api/oca', require('./routes/competency-assignment'));
app.use('/api/oca', require('./routes/assessment'));
app.use('/api/oca', require('./routes/announcements'));
app.use('/api/oca', require('./routes/idp'));

module.exports = app;
