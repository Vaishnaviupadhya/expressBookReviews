const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  //Write your code here
  console.log(users); // display list of users in the console

  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
 return res.status(300).json(books);
});
// public_users.get('/', async function (req, res) 
// {  axios.get('http://localhost:5500/books')    
// .then(response => {return res.status(200).json(response.data); 
// }).catch(error => { 
//   console.error(error); 
//   return res.status(500).json({ message: 'Error retrieving books' });
// });}); 


public_users.get('/books', function (req, res) {
  axios.get('http://localhost:5500')
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving books' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
 // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const booksByAuthor = {};
//   let count = 0;
//   for(let isbn in books) {
//     if(books[isbn].author.toLowerCase() === author.toLowerCase()) {
//       booksByAuthor[isbn] = books[isbn];
//       count++;
//     }
//   }
//   if(count === 0) {
//     return res.status(404).json({message: "No books found by the author"});
//   }
//   return res.json(booksByAuthor);
//  // return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/isbn/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const promise = new Promise(function(resolve, reject) {
      resolve(book);
    });
    promise.then(function(book) {
      res.json(book);
    }).catch(function(error) {
      res.status(500).json({ message: error.message });
    });
  } else {
    const promise = new Promise(function(resolve, reject) {
      reject({ message: 'Book not found' });
    });
    promise.catch(function(error) {
      res.status(404).json(error);
    });
  }
});

//Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const booksByTitle = {};
//   let count = 0;
//   for(let isbn in books) {
//     if(books[isbn].title.toLowerCase() === title.toLowerCase()) {
//       booksByTitle[isbn] = books[isbn];
//       count++;
//     }
//   }
//   if(count === 0) {
//     return res.status(404).json({message: "No books found by the author"});
//   }
//   return res.json(booksByTitle);
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

//  Get book review
public_users.get('/author/:author', function(req, res) {
  const author = req.params.author;
  const booksByAuthor = {};
  let count = 0;

  // Create a new Promise object
  const promise = new Promise((resolve, reject) => {
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor[isbn] = books[isbn];
        count++;
      }
    }
    if (count === 0) {
      reject({message: "No books found by the author"});
    } else {
      resolve(booksByAuthor);
    }
  });

  // Handle the resolved promise
  promise.then((booksByAuthor) => {
    return res.json(booksByAuthor);
  })
  // Handle the rejected promise
  .catch((error) => {
    return res.status(404).json(error);
  });
});
public_users.get('/title/:title', function(req, res) {
  const title = req.params.title;
  let booksByTitle = {};
  let count = 0;
  let promise = new Promise(function(resolve, reject) {
    for(let isbn in books) {
      if(books[isbn].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle[isbn] = books[isbn];
        count++;
      }
    }
    if(count === 0) {
      reject({message: "No books found by the title"});
    }
    resolve(booksByTitle);
  });

  promise.then(function(result) {
    res.json(result);
  }).catch(function(error) {
    res.status(404).json(error);
  });
});

public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  const reviews = book.reviews;

  return res.status(200).json({reviews: reviews});
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
