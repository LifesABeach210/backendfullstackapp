var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');
var adminRouter = require('./routes/admin');

var app = express();
var { mongoConnect } = require('./mongo.js');
      mongoConnect();


app.use('/admin', adminRouter);
app.use(cors())
app.use('/blogs', blogsRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
