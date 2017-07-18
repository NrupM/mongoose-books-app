let mongoose = require('mongoose'),
let Schema = mongoose.Schema;

//create schema for authors
let AuthorSchema = new Schema({
  name: String,
  alive: Boolean,
  image: String
});

//create an Author model from Schema
let Author = mongoose.model('Author', AuthorSchema);

//export Author model
module.exports = Author;
