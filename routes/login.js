const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/', passport.authenticate('localLogin', {
 successRedirect: '/account',
 successFlash: true,
 failureRedirect: '/',
 failureFlash: true
}));

/*
router.post('/', (req, res, next) =>{
  User.findOne({email: req.body.email}, (err, data) =>{
    if(err) return next(err);
    if(data && req.body.password === data.password){
      res.json({
        data: data
      });
    }
    else {
      console.log('No such user found');
      let errMsg = {message: 'WRONG!'};
      return next(new Error('Invalid Login.'));
    }
  });
});
*/
module.exports = router;
