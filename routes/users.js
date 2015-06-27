var express = require('express');
var passport = require('passport');
var multer = require('multer');
var router = express.Router();

/* GET users listing. */
router.route('/login')
  .get(function(req, res, next) {
    res.render('auth/login', {
      errorMessage: req.flash('errorMessage'),
      successMessage: req.flash('successMessage'),
    });
  })
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

/* GET users listing. */
router.route('/register')
  .get(function(req, res, next) {
    res.render('auth/register', {
      errorMessage: req.flash('errorMessage'),
      successMessage: req.flash('successMessage'),
    });
  })
  .post([
    multer({
      dest: './public/images/profiles',
      rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
      }
    }),
    passport.authenticate('register', {
      successRedirect: '/users/login',
      failureRedirect: '/users/register',
      failureFlash : true  
    })
  ]);

router.get('/logout', function (req, res){
  req.logout();
  req.flash('successMessage', 'You have successfully logged out!');
  res.redirect('/');
});

module.exports = router;
