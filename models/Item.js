const mongoose = require('mongoose');

const Item = new mongoose.Schema({
  name: {type: String, default: ''},
  description: {type: String, default: ''},
  price: {type: Number, defaule: 0},
  interested: {type: Array, default: []}, //list of users interested in item
  timestamp: {type: Date, default:Date.now}
});

module.exports = mongoose.model('Item', Item);
