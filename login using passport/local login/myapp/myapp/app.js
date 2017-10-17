var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');  
var app = express();

mongoose.connect("mongodb://localhost:27017/nodedb"); 
var User = require('./models/user');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret:'guanjianhua',cookie:{maxAge:2000}}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// passport
//保存user对象
passport.serializeUser(function (user, done) {
    done(null, user);
});
//删除user对象
passport.deserializeUser(function (user, done) {
    done(null, user);
});


//
passport.use('signup',new LocalStrategy(
    function(username, password, done) {
	User.findOne({"local.username":username},function(err,user){
	if (err){
		 console.log('1');
		 return done(err);
	}
	if (user){
		console.log('2');
		return done(null, false, { message: '请正确输入密码' });
	}else{
		var newUser = new User();
          newUser.local.username=username;
          newUser.local.password = password;
          newUser.save(function(err) {
            if (err)
              throw err;
			  console.log('error');
			  console.log('New user successfully created...',newUser.local.username);
              //console.log('email',email);
              console.log(newUser);
              return done(null, newUser);
			  //console.log(newUser);
          });
	}
  }
	)}
));
//

 passport.use('login', new LocalStrategy(
  function(username, password, done) {
	 var pwd=password;
    User.findOne({ 'local.username': username}, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false);
     // if (this.local.password !==pwd)
       //   return done(null, false);
	  console.log(user);
      return done(null, user);
	  
    });
  }));
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
