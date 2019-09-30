const express = require('express');
const routes = require('./routes/index.js');
const path = require('path');
const bPar = require('body-parser'); //allow parse data from webpage
const moment = require('moment');

const app = express();

app.use(bPar.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
//middleware
app.use((req, res, next) => {
  req.timestamp = moment().format("MMMM Do YYYY h:mm:ss a");
  console.log(`Request made to route:${req.url} on ${req.timestamp}`);
  next();
});

app.use('/', routes);


app.set('view engine', 'hjs');
app.set('views', path.join(__dirname, 'views'));

app.listen(4000, () =>{
  console.log('Listening on port 4000.');
});
