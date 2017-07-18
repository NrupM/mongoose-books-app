// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////


//require express in our app
let express = require('express'),
    bodyParser = require('body-parser');

//connect to db models //import models module
let db = require('./models');

// generate a new express app and call it 'app'
let app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////
//  ROUTES
///////////////////

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books){
    if (err) { return console.log("index error: " + err);}
    // send all books as JSON response
    res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findOne({ _id: req.params.id}, function(err, data){
    res.json(data);
  });
});

//create new book
app.get('/api/books/:id', function (req,res){
  //create new book with form data (`req.body`)
  console.log('books create', req.body);
  let newBook = new db.Book(req.body);
  newBook.save(function handleDBBookSaved(err, savedBook){
    res.json(savedBook);
  });
});

// // update book
// app.put('/api/books/:id', function(req,res){
// // get book id from url params (`req.params`)
//   console.log('books update', req.params);
//   let bookId = req.params.id;
//   // find the index of the book we want to remove
//   db.Book.findOne( { _id: bookId }, function (err, foundBook){
//     foundBook.title = req.body.title;
//     foundBook.author = req.body.author;
//     foundBook.image = req.body.image;
//     foundBook.releaseDate = req.body.releaseDate;
//
//     //save updated book in db
//     foundBook.save(function (err, foundBook){
//       res.json(foundBook)
//     });
//   });
// });

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  let bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOneAndRemove({ _id: bookId}, function (err, deletedBook){
    res.json(deletedBook);
  });
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
