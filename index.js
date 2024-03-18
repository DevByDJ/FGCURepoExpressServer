require('dotenv').config();
const express = require('express');
const log = require('./logger');
const fileUpload = require('express-fileupload');
const path = require('path');
const analyticsRouter = require('./routes/analytics');
const tagRouter = require('./routes/tag');
const companyRouter = require('./routes/company');
const internshipRouter = require('./routes/internship');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const postRouter = require('./routes/post');
const eventRouter = require('./routes/event');
const commentRouter = require('./routes/comment');
const registerRouter = require('./routes/register');
const verifyRouter = require('./routes/verify');
const fpRouter = require('./routes/forgot-password');
const rpRouter = require('./routes/reset-password');
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
app.use('/api/analytics', analyticsRouter);

app.use('/api/tag', tagRouter);

app.use('/api/user', userRouter);

app.use('/api/login', loginRouter);

app.use('/api/register', registerRouter);

app.use('/api/verify', verifyRouter);

app.use('/api/forgot-password', fpRouter);

app.use('/api/reset-password', rpRouter);

app.use('/api/company', companyRouter);

app.use('/api/internship', internshipRouter);

app.use('/api/post', postRouter);

app.use('/api/comment', commentRouter);

app.use('/api/event', eventRouter);

app.get('/', (req, res) => {
  log('Server is running..');
});

// -- Middleware that tracks the actions in the application --
function logger(req, res, next) {
  log(`The current URL path is: ${req.originalUrl}`);
  next();
}

module.exports = app;
