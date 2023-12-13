require('dotenv').config();
const express = require('express');
const tagRouter = require('./routes/tag');
const companyRouter = require('./routes/company');
const internshipRouter = require('./routes/internship');
const studentRouter = require('./routes/student');
const cors = require('cors'); 

// -- The utilities the application uses --
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(logger);

// -- Routers --

app.use('/api/tag', tagRouter);

app.use('/api/student', studentRouter);

app.use('/api/company', companyRouter);

app.use('/api/internship', internshipRouter);

app.get('/', (req, res) => {
  console.log('Server is running..');
});

// -- Middleware that tracks the actions in the application --
function logger(req, res, next) {
  console.log(`The current URL path is: ${req.originalUrl}`);
  next();
}

module.exports = app;
