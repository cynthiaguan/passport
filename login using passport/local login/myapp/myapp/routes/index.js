var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index',{
		title:'express',
		message:req.flash('error').toString()
	});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login page' });
});
router.get('/signup', function(req, res) {
  res.render('signup.ejs', { title: 'Register page' });
});
router.post('/login',
    passport.authenticate('login',{
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
		
    })
);
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/',
  failureFlash: true,
}));
 console.log('123');
router.get('/home', function(req, res, next) {
  //console.log(req.user);
  res.render('home', { title: 'user',
  user:req.user
  });
});	
console.log('guan');
module.exports = router;
