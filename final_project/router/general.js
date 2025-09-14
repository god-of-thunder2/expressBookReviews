const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 6 (Assuming 'users' is imported from auth_users.js)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" }); // [cite: 142]
  }

  // Check if the username already exists (assuming 'isValid' function doesn't exist yet, we check the 'users' array)
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" }); // [cite: 142]
  }

  // If new user, add to the users array
  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 1
// public_users.get('/', function (req, res) {
//   // Use JSON.stringify with spacing (null, 4) for neat formatting
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Solution for Task 10 (using a Promise)

// Function that returns a Promise resolving with the books list
function getAllBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "Book database not found" });
        }
    });
}

// Update the route handler to use the Promise
public_users.get('/', function (req, res) {
  getAllBooks()
    .then((allBooks) => {
      return res.status(200).send(JSON.stringify(allBooks, null, 4));
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

// Solution for Task 2
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "ISBN not found" });
//   }
// });

// Solution for Task 11 (using Async/Await in the route)

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ message: "ISBN not found" });
        }
    });
}

// Update the route handler to be async
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json(error);
  }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 3
// public_users.get('/author/:author', function (req, res) {
//   const authorName = req.params.author.toLowerCase();
//   const bookKeys = Object.keys(books); // Get all keys (ISBNs) 
//   let results = [];

//   bookKeys.forEach((key) => {
//     if (books[key].author.toLowerCase() === authorName) {
//       results.push(books[key]);
//     }
//   });

//   if (results.length > 0) {
//     return res.status(200).json(results);
//   } else {
//     return res.status(404).json({ message: "No books found by that author" });
//   }
// });

// Solution for Task 12 (using Promise .then())

function getBooksByAuthor(authorName) {
    return new Promise((resolve, reject) => {
        const lowerAuthorName = authorName.toLowerCase();
        const bookKeys = Object.keys(books);
        let results = [];

        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === lowerAuthorName) {
                results.push(books[key]);
            }
        });

        if (results.length > 0) {
            resolve(results);
        } else {
            reject({ message: "No books found by that author" });
        }
    });
}

// Update the route handler
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  getBooksByAuthor(authorName)
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 4
// public_users.get('/title/:title', function (req, res) {
//   const titleName = req.params.title.toLowerCase();
//   const bookKeys = Object.keys(books);
//   let results = [];

//   bookKeys.forEach((key) => {
//     if (books[key].title.toLowerCase() === titleName) {
//       results.push(books[key]);
//     }
//   });

//   if (results.length > 0) {
//     return res.status(200).json(results);
//   } else {
//     return res.status(404).json({ message: "No books found with that title" });
//   }
// });

// Solution for Task 13 (using Async/Await)

function getBooksByTitle(titleName) {
    return new Promise((resolve, reject) => {
        const lowerTitleName = titleName.toLowerCase();
        const bookKeys = Object.keys(books);
        let results = [];

        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === lowerTitleName) {
                results.push(books[key]);
            }
        });

        if (results.length > 0) {
            resolve(results);
        } else {
            reject({ message: "No books found with that title" });
        }
    });
}

// Update the route handler
public_users.get('/title/:title', async function (req, res) {
  const titleName = req.params.title;
  try {
    const matchingBooks = await getBooksByTitle(titleName);
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json(error);
  }
});

//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Solution for Task 5
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.general = public_users;
