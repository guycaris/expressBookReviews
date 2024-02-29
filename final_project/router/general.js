const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Helper Function
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const getBookByISBN = (isbn) => {
  return books[isbn];
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Make sure you have provided a username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books));

  let myPromise = new Promise((resolve,reject) => {
    let booklist = JSON.stringify(books);
    resolve(booklist);
  })

  myPromise.then((booklist) => {
    res.send(booklist);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let book;
  let myPromise = new Promise((resolve,reject) => {
    let isbn = req.params.isbn;
    resolve(getBookByISBN(isbn));
  });

  myPromise.then((book) => {
    res.send(book);
  });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let myPromise = new Promise((resolve, reject) => {
    let author = req.params.author;
    let bookkeys = Object.keys(books);

    bookkeys.forEach((key) => {
      if(books[key].author == author){
        resolve(books[key]);
      }
    });
  })
  
  myPromise.then((book) => {
    res.send(book);
  });
  

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let myPromise = new Promise((resolve, reject) => {
    let title = req.params.title;
    let bookkeys = Object.keys(books);

    bookkeys.forEach((key) => {
      if(books[key].title == title){
        resolve(books[key]);
      }
    });
  });
  
  myPromise.then((book) => {
    res.send(book);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
