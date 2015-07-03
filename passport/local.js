var bcrypt = require('bcrypt-nodejs');
var gm = require('gm');

var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  // get/release user from session store
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // pass req to call back lets us use any req param in strat
    }, 
    function(req, email, password, done) {
      User.findOne({'email': email.toLowerCase()},
        function(err, user) {
          if (err) return done(err);
          
          if (!user) {
            console.log('No user found');
            return done(null, false,
              req.flash('errorMessage', 'User not found!'));
          }

          if (!isValidPassword(user, password)) {
            console.log('Invalid password');
            return done(null, false,
              req.flash('errorMessage', 'Invalid password'));
          }

          return done(null, user, req.flash('successMessage', 'Login successful!'));
        })
    })
  );

  passport.use('register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, 
    function(req, email, password, done) {
      findOrCreateUser = function() {
        User.findOne({'email': email.toLowerCase()}, function(err, user) {
          if (err) {
            console.log('Error in sign-up: ' + err);
            return done(err);
          }
          if (user) {
            console.log('User already exists.');
            return done(null, false,
              req.flash('errorMessage', 'User already exists'));
          } else {
            console.log('Creating a new user');
            User.register
            // if there is no user with that email
            // create the user
            var newUser = new User();
            newUser.username = req.body['username'];
            newUser.email = email;
            newUser.password = createHash(password);
            newUser.name = req.body['name'];

            var profileLocation = req.files['picture'].path;

            if (req.body.pictureCanvasData !== undefined) {
              canvasData = JSON.parse(req.body.pictureCanvasData);
              cropBoxData = JSON.parse(req.body.pictureCropBoxData);

              // crop according to args from cropper, taking into
              // account image resizing within the canvas
              gm(profileLocation)
                .resize(canvasData.width, canvasData.height)
                .crop(cropBoxData.width, cropBoxData.height,
                  cropBoxData.left - canvasData.left,
                  cropBoxData.top - canvasData.top)
                .write(profileLocation, function(err) {
                  if (!err) console.log('Finished cropping');
                  else console.log(err);
                });
            }

            // req.files includes details about the already processed
            // uploaded image from multer. The name is the name of the
            // picture after it has been saved by multer. 

            // note, we save it to the absolute path, when we should
            // consider saving the name. this is a hack because my
            // filler data uses an HTTPS url rather than a file path
            // TODO: harmonize path/http url profiles
            newUser.profile = profileLocation;
            
            newUser.save(function(err) {
              if (err) {
                console.log('Error in saving user: ' + err);
                throw err;
              }

              console.log('User registration successful');
              req.flash('successMessage', 'Registration successful. You may now login');
              return done(null, newUser);
            });
          }
        });
      };

      process.nextTick(findOrCreateUser);
    })
  );
  
  // BCRYPT HELPERS
  var isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  var createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
}