const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
  if(req.user){
    res.redirect('/account');
    return;
  }
  var msg = {
    message : req.flash('error')
  }
  res.render('index', msg); //render index.hjs

});

module.exports = router;
