const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
//authenticate
const auth = require('./config/auth.js')(passport);
//router
const index = require('./routes/index.js');
const register = require('./routes/register.js');
const login = require('./routes/login.js');
const account = require('./routes/account.js');
const admin = require('./routes/admin.js');

const app = express();
//config session
app.use(session({
  secret: '23wqeidFAFVoqeASw',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());    //passport will manage user sessions

//mongo connect
mongoose.connect('mongodb://localhost/WApp', {useNewUrlParser: true, useUnifiedTopology: true}, (err, data) => {
  if(err) throw err;
  console.log('Connection to MongoDB successful.');
});

//setup view dir and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

//setup  middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//setup static assets
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', index);
app.use('/register', register);
app.use('/login', login);
app.use('/account', account);
app.use('/admin', admin);

//error route
app.use((err, req, res, next) => {
  res.render('error', {message: err});
});

app.listen(4000,() => {
  console.log('Port 4000 is listening...');
});
