require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const tagRouter = require('./routes/tag');
const companyRouter = require('./routes/company');
const internshipRouter = require('./routes/internship');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const cors = require('cors'); 

// -- The utilities the application uses --
const app = express();

app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logger);

// -- Routers --

app.use('/api/tag', tagRouter);

app.use('/api/user', userRouter);

app.use('/api/login', loginRouter);

app.use('/api/register', registerRouter);

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
