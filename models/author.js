var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create schema for authors
var AuthorSchema = new Schema({
  name: String,
  alive: Boolean,
  image: String
});

//create an Author model from Schema
var Author = mongoose.model('Author', AuthorSchema);

//export Author model
module.exports = Author;
