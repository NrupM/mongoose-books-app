// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////


//require express in our app
var express = require('express'),
    bodyParser = require('body-parser');

//connect to db models //import models module
var db = require('./models');

// generate a new express app and call it 'app'
var app = express();

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

//****************//
//  BOOK ROUTES   //
//****************//

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
  //populate fills in the author id with all the author data
  .populate('author')
  .exec(function(err, books){
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id)
  // have the author id standing in place of the author itself - so need to // get the id and populate the author field it with the actual author data
    .populate('author')
    .exec(function(err, book){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(book);
    });
});

//create new book
app.post('/api/books', function (req,res){
  //create new book with form data (`req.body`)
  console.log('books create', req.body);
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });

  //find the author from req.body
  db.Author.findOne({name: req.body.author}, function (err, author){
    if (err) {
      return console.log(err);
    }
    //add this author to the book
    if (author === null) {
      db.Author.create({name: req.body.author, alive: true}, function (err, newAuthor){
        createBookWithAuthorAndRespondTo(newBook, newAuthor, res);
      });
    } else {
      createBookWithAuthorAndRespondTo(newBook, author, res);
    }
  });
});

function createBookWithAuthorAndRespondTo(book, author, res){
  //add this author to the book
  book.author = author;
  //save newBook to database
  book.save(function(err, book){
    if (err) {
      return console.log("save error: " + err);
    }
    console.log("saved ", book.title);
    //send back the book
    res.json(book);
  });
}

//delete book
app.delete('/api/books/:id', function (req, res){
  //get book id from url params
  console.log(req.params)
  var bookId = req.params.id;

  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook){
    res.json(deletedBook);
  });
});

//****************//
//CHARACTER ROUTES//
//****************//

// Create a character associated with a book
app.post('/api/books/:book_id/characters', function (req, res) {
  // Get book id from url params (`req.params`)
  var bookId = req.params.book_id;
  db.Book.findById(bookId)
    .populate('author')
    .exec(function(err, foundBook) {
      // handle errors
      if (err) {
        res.status(500).json({error: err.message});
      } else if (foundBook === null) {
        //check if foundBook is undefined
        res.status(404).json({error: "No Book found by this ID"});
      } else {
        // for this foundBook - push characters from req.body form into characters array
        foundBook.characters.push(req.body);
        // save the book with the new character
        foundBook.save();
        // send the entire book back
        res.status(201).json(foundBook);
      }
      console.log(foundBook);

    });
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
