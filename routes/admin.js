const express = require('express');
const router = express.Router();
const Item = require('../models/Item.js');

router.get('/', (req, res, next) =>{

  if(req.user && req.user.isAdmin){

    Item.find(null, (err, items) => {
      if(err) return next(err);
      const data = {
        user: req.user,
        items: items
      }
      res.render('admin', data);
    });

  }
  else{
    res.redirect('/');
  }
});
//Item Cresting post request
router.post('/additem', (req, res, next) => {
  const user = req.user;
  if(user && user.isAdmin){
    Item.create(req.body, (err, item) => {
      if(err) return next(err);
      res.redirect('/admin');
    })
  }

  else{
    res.redirect('/');
    return;
  }

});

module.exports = router;
