const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  location: String,
  postedBy: String
});

module.exports = mongoose.model('Item', itemSchema);