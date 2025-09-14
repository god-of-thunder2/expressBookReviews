const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// This helper function must be correct
const authenticatedUser = (username, password) => {
  // Filter the users array to find matching username AND password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  
  // If the filter finds 1 (or more) user, the length will be > 0
  return validusers.length > 0; 
}

//only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 7
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Validate the user credentials (assuming 'authenticatedUser' function exists)
  if (authenticatedUser(username, password)) {
    // Create JWT
    let accessToken = jwt.sign({
      data: username // Storing username in the JWT payload
    }, 'access', { expiresIn: 60 * 60 }); // 'access' is the secret, token expires in 1 hour

    // Save token in the session 
    req.session.authorization = {
      accessToken
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.user.data; // Username extracted from the JWT by the middleware

  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required in query" });
  }

  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    // Add or update the review. 
    bookReviews[username] = reviewText;

    books[isbn].reviews = bookReviews; // Save changes back to the main books object
    return res.status(200).json({ message: "Review successfully added/updated", reviews: bookReviews });
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

// Solution for Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data; // Username from the verified session token

  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    
    // Check if a review from this user exists
    if (bookReviews[username]) {
      delete bookReviews[username]; // Delete only the review belonging to this user 
      return res.status(200).json({ message: "Review successfully deleted", reviews: bookReviews });
    } else {
      return res.status(404).json({ message: "No review found for this user on this ISBN" });
    }
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
