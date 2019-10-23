const express = require('express');
const router = express.Router();
const Item = require('../models/Item.js');
const User = require('../models/User.js');
const mailgun = require("mailgun-js");
const bcrypt = require('bcryptjs');
const DOMAIN = 'sandboxbb4a1f0c7e5e46378321425066fbea9f.mailgun.org';
const MG_API_KEY = '03095ce3b74a613260d0a9c13fe3a9de-2dfb0afe-b249ecba'


const randomString = (length) => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  for(var i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random()*(possible.length - 1)));
  }
  return text;
}


router.get('/', (req, res, next) => {
  //from next(null, user) in auth.js is bound to req param
  if(req.user){
    Item.find(null, (err, items) => {
      if(err) return next(err);
      //this gets all items that contain the users id in iterested array
      Item.find({interested: req.user._id}, (err, itemList) =>{
        if(err) next(nerr)
        const data = {
          user: req.user,
          items: items,
          listItems: itemList
        }
        res.render('account', data);
      })

    });
  }
  else{
    res.redirect('/');
  }

})
//adding an item to user interests
router.get('/additem/:id', (req, res, next) =>{
  const user = req.user;
  if(!user){
    res.redirect('/');
    return
  }
  Item.findById(req.params.id, (err, item) =>{
    if(err){
      return next(err);
    }
    //Check if the user is already interested in this item
    if(item.interested.indexOf(user._id) == -1){
      item.interested.push(user._id);
      item.save();
      res.redirect('/account');
    }
    else{
      res.redirect('/account');
    }
  });
});
router.get('/removeitem/:id', (req, res, next) =>{
  const user = req.user;
  if(!user){
    res.redirect('/');
    return
  }
  Item.findById(req.params.id, (err, item) =>{
    if(err){
      return next(err);
    }
    //Check if the user is already interested in this item
    if(item.interested.indexOf(user._id) != -1){
      item.interested.remove(user._id);
      item.save();
      res.redirect('/account');
    }
    else{
      res.redirect('/account');
    }
  });
});

router.post('/resetpassword', (req, res, next) =>{
  User.findOne({email: req.body.email}, (err, user) =>{
    if(err) {
      return next(err);
    }
    user.nonce = randomString(8);
    user.passwordResetTime = new Date();
    user.save();
    const mg = mailgun({apiKey: MG_API_KEY, domain: DOMAIN});
    const data = {
    	from: 'llyodus@gmail.com',
    	to: req.body.email,
    	subject: 'Hello part 2',
    	html: 'Please click <a style="color:red" href="http://localhost:4000/account/password-reset?nonce='+user.nonce+'&id='+user._id+'">HERE</a> to reset your password. This link is valid for 24 hours.'
    };
    mg.messages().send(data, function (err, body) {
      if(err) return next(err);
      res.json({
        confirmation: 'success'
      });
    });
  });
});
router.get('/password-reset', (req, res, next) =>{
  const nonce = req.query.nonce;
  const user_id = req.query.id;
  if(!nonce || !user_id){
    return next(new Error('Invalid Request'));
  }
  User.findById(user_id, (err, user) => {
    if(err || !user.passwordResetTime || !nonce || nonce != user.nonce){
      return next(new Error('Invalid Request'));
    }
    const now = new Date();
    const diff = now - user.passwordResetTime; //time in ms
    const seconds = diff/1000;
    if(seconds > 60*60*24){
      return next(new Error('Invalid Request'))
    }
    const data = {
      id: user_id,
      nonce: nonce
    }
    res.render('password-reset', data);
  });
} );
router.post('/newpassword', (req, res, next) => {
  if(!req.body.password1 || !req.body.password2 || !req.body.nonce || !req.body.id){
    return next(new Error('Invalid Request1'));
  }
  if(req.body.password1 != req.body.password2){
    return next(new Error('Passwords do not match!'));
  }
  User.findById(req.body.id, (err, user) => {
    if(err) return next(err);
    if(!user.passwordResetTime || !req.body.nonce || req.body.nonce != user.nonce){
      return next(new Error('Invalid Request2'));
    }

    const diff = new Date() - user.passwordResetTime;
    const seconds = diff/1000;
    if(seconds > 60*60*24){
      return next(new Error('Invalid Request3'));
    }
    const hpw = bcrypt.hashSync(req.body.password1, 10);
    user.password = hpw;
    user.save();

    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  //.logout is provided by passport and destroys te session
  req.logout();
  res.redirect('/');
})
module.exports = router;
