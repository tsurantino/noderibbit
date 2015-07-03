var faker = require('faker');
var random = require('random-js')();
var capitalize = require('string-capitalize'); // lol

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Ribbit = require('../models/ribbit');

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    var perPage = 10
      , page = req.param('page') > 0 ? req.param('page') : 0

    console.log(page);

    Ribbit.getRibbits(null, perPage, perPage * page, function(err, ribbits) {
      Ribbit.count().exec(function(err, count) {
        res.render('index', {
          user: req.user,
          ribbits: ribbits,
          page: page,
          pages: count / perPage,
          errorMessage: req.flash('errorMessage'),
          successMessage: req.flash('successMessage'),
        });
      })
    })
  })
  .post(function(req, res) {
    // create the ribbit, THEN add it to the user
    // so as to allow cross referencing 
    // ie show all tweets from all users
    var ribbit = new Ribbit(req.body);
    ribbit.owner = req.user._id;
    ribbit.save();

    req.user.ribbits.push(ribbit);
    req.user.save();

    res.redirect('/');
  });

router.route('/filler')
  .get(function(req, res) {
    console.log('\n\nGenerating Filler Data\n');
    
    var numUsers = 10;
    for (var i = 1; i <= numUsers; i++) {
      var newUser = new User({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.name.findName(),
        profile: faker.internet.avatar(),
      });

      newUser.save();

      for (var j = 1; j <= random.integer(4, 12); j++) {
        newRibbit = new Ribbit({
          content: capitalize(faker.lorem.sentence()), 
          created: faker.date.recent(),
          owner: newUser._id, 
        })
        newRibbit.save();
        newUser.ribbits.push(newRibbit);
        newUser.save();
      }

      console.log(newUser + '\n');
    }

    console.log('Generated ' + numUsers + ' users\n\n');
    res.redirect('/');
  })

module.exports = router;
