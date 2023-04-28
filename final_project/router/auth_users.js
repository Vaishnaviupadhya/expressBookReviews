const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const fs = require('fs');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if (!username) {
  return false;
}

const alphanumericRegex = /^[a-zA-Z0-9]+$/;
return alphanumericRegex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
console.log(users);
const foundUser = users.find(user => user.username === username && user.password === password);
return Boolean(foundUser);
}
regd_users.get('/book/:isbn',function(req,res){
  const isbn=req.params.isbn;
  console.log()
  return res.status(300).json(books[isbn].reviews);
  });
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

if (!isValid(username)) {
return res.status(400).json({message: "Invalid username"});
}

if (!authenticatedUser(username, password)) {
return res.status(401).json({message: "Incorrect username or password"});
}

const token = jwt.sign({ username }, "123");
req.session.token = token;
return res.json({message:"Logged in"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  //Write your code here
  
    //const {isbn} = req.params;
   // const {username, review} = req.body;
   const {username} = req.body;
   const review=req.params.review;
  const isbn=req.params.isbn
    if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username"});
    }
    
    const book = books[isbn];
    
    if (!book) {
    return res.status(404).json({message: "Book not found"});
    }
    
    if (review=="delete") {
    //return res.status(400).json({message: "Review cannot be empty"});
    delete books[isbn].reviews[username];
    fs.writeFile("booksdb.js", "module.exports = " + JSON.stringify(books), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");}
      });
    return res.json({message: "Review deleted successfully for the book with isbn"+isbn});
    }
    
    books[isbn].reviews[username]=review;
    //book.reviews[isbn].review = {review };
    //console.log(book);
    //console.log(book[isbn].reviews+review);
    console.log(books);
    fs.writeFile("booksdb.js", "module.exports = " + JSON.stringify(books), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");}
      });
    res.json({message: "Review added successfully for the book with isbn"+isbn});
  //return res.status(300).json({message: "Yet to be implemented"});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
