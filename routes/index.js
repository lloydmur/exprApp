const express = require('express');
const bPar = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://identius:passius12@cluster0-hyj9l.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  food: String
});

const User = new mongoose.model('User', userSchema);

const router = express.Router();
var profiles = [
  {name: 'Kim Jong Il', job: 'God Amongst Men'},
  {name: 'Kim Jong Un', job: 'Savior'},
  {name: 'Donkey Kong', job: 'Messiah'},
  {name: 'Llyod'},
]

router.get('/', (req, res, next) =>{
  const data = {
    profiles: profiles,
    name: profiles[0].name
  }
  res.render('index', data);
});
router.get('/a', (req, res, next) =>{
  res.send();
});
router.get('/login', (req, res, next) => {
  res.render('login', null);
})
router.post('/login', (req, res, next) =>{
  User.find({username: req.body.username, password: req.body.password}, (err, data) => {
    if(err) throw err;
    if(data.length === 1){
      console.log('User found:' + data[0].username);
      res.render('profile', data[0]);
    }
    else{
      let errMsg = {message: 'Invalid login credentials, please try again.'};
      res.render('login', errMsg);
    }
  });
})
router.post('/join', (req, res, next) => {
  let item = {
    name: req.body.username,
    job: req.body.password,
    food: req.body.food
  };
  let newUser = User(req.body).save((err,data) => {
    if(err) throw err;
    profiles.push(item);
    res.redirect('/');
  });
  //res.redirect('/');
});

module.exports = router;
