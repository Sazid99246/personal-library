/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
//read our env variables//
require('dotenv').config()
//import mongoose//
const mongoose = require('mongoose');
//connect to db//
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
//define schema for a book entry//
let bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentcount: Number,
  comments: [String]
}) //initialize the model//
let Book = mongoose.model('Book', bookSchema)



module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let bookRay = []
      Book.find(
        ({}), //empty filter for now
        (error, books) => {
          if(!error && books){
            //console.log(books)
            books.forEach((book) => {
              bookRay.push({
                _id: book._id,
                title: book.title,
                commentcount: book.commentcount,
                comments: book.comments
              })
            })
            res.json(bookRay)
          }
        }
      )
    })

    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if(!req.body.title){
        return res.json('missing required field title');
      }
      let newBook = new Book({
        title: title,
        commentcount: 0,
        comments: []
      })
      newBook.save((error, savedBook) => {
        if(!error && savedBook) {
          //console.log('Saved book: ' + savedBook)
          res.json(savedBook)
        }
      })
    })
    

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany(
        { }, 
        (err, result) => {
        if(!err){
          res.send('complete delete successful')
        }else if(err){
          console.log(err)
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookid = req.params.id;
      Book.findById(bookid, function (err, book) {
        if(!err && book) {
          console.log(book)
          res.json({
            _id: book._id,
            title: book.title,
            comments: book.comments
          })
        } else {
          res.json('no book exists')
        }
      })

    })

    
    .post(function(req, res){
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        return res.json('missing required field comment')
      }
      Book.findByIdAndUpdate(
        bookid, //the id to look for
        { //updates to apply, we can push to an array like this!
          $push: { comments: comment },
          //increment commentcount
          $inc: { commentcount: 1 }

        }, 
        { new: true },
        (error, updatedBook) => {
          if(!error && updatedBook) {
            return res.json({
              _id: updatedBook._id,
              title: updatedBook.title,
              comments: updatedBook.comments
            })
          }else if(!updatedBook){
            return res.json('no book exists')
          }
        }
      )

    })
    

    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne(
        { _id: bookid }, 
        (err, result) => {
        if(!err && result.deletedCount !== 0){
          res.json('delete successful')
        //a result will be returned even if nothing is deleted, we can test deletedCount.
        }else if(result.deletedCount === 0){
          res.json('no book exists')
        }
      })
    });
  
};