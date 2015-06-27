var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    res.render('index', {
      user: req.user,
      errorMessage: req.flash('errorMessage'),
      successMessage: req.flash('successMessage'),
    })
  })
  .post(function(req, res) {
    console.log(req.body);
    res.redirect('/');
  })

module.exports = router;
