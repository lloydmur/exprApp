const express = require('express');
const router = express.Router();
const passport = require('passport');

//the post req body is sent to the local strat in auth.js for processing
router.post('/', passport.authenticate('localRegister', {
  successRedirect: '/account',
  failureRedirect: '/',
  failureFlash: true
}));

/*
router.post('/', (req, res, next) =>{
  User.create(req.body, (err, data) => {
    if(err) throw err;
    res.json({
      user: data
    });
  });
});
*/
module.exports = router;
