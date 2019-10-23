const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
//passport is a library that handles login state

module.exports = (passport) => {
  //Stores user inside session
  passport.serializeUser((user, next) => {
    next(null, user);
  });
  //Find currently logged in user
  passport.deserializeUser((id, next) => {
    //gets user from id from MongoDB and passes it to next
    User.findById(id, (err, user) => {
      next(err, user);
    });
  })
//The actualy strategy where passport is told how to log users in or not
//basically login rules
  const localLogin = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //passes req to callback
  },
    //callback
    (req, email, password, next) => {
      User.findOne({email: email}, (err, user) => {

        if(err){
          return next(err);
        }
        if(user && bcrypt.compareSync(password, user.password)){
          //next(err, data)
          return next(null, user);
        }
        else {
          //message is stored in req.flash('error')
          return next(null, false, {message: 'Invalid Login'});
        }
      });
    });
  passport.use('localLogin', localLogin);

  //Registration rules and user creation handler
  const localRegister = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    //req.body will contain registrarion form data
    (req, email, password, next) => {
      User.findOne({email: email}, (err, user) => {
        if(err) throw err;
        if(user){
          //if user exists
          return next(new Error('User already exists.'));
        }
        else{
          //encrypt user password for security
          let hpw = bcrypt.hashSync(password, 10);
          //check if admin
          let adm = false;
          if(email.indexOf('ADMIN') != -1) adm = true;
          //if new user
          User.create({email: email, password: hpw, isAdmin: adm}, (err, user) => {
            if(err) return next(err);
            next(null, user);
          });
        }
      });
    });
    passport.use('localRegister', localRegister);
}
