/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const Validator = require('validator');
const Book = mongoose.model('book');

module.exports = function(app) {
  app
    .route('/api/books')
    .get(async function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book.find({});

      let temp = [];
      for (let i = 0; i < books.length; i++) {
        let obj = {};
        obj._id = books[i]._id;
        obj.title = books[i].title;
        obj.commentcount = books[i].comments.length;
        temp.push(obj);
      }

      res.json(temp);
    })

    .post(async function(req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.status(400).send('no title provided');
      let book = new Book({ title });
      await book.save();
      res.json(book);
    })

    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({});
      res.send('complete delete successful');
    });

  app
    .route('/api/books/:id')
    .get(async function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book;
      try {
        book = await Book.find({ _id: bookid });
      } catch (e) {
        return res.status(400).send('no book by given id');
      }
      res.json(book);
    })

    .post(async function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get

      // console.log(req.params);
      // console.log(req.body);
      const book = await Book.findOneAndUpdate(
        { _id: bookid },
        { $push: { comments: comment } },
        { new: true }
      );

      res.json(book);
    })

    .delete(async function(req, res) {
      // console.log(req.params);
      // console.log(req.query);
      var bookid = req.params.id || req.query.id;
      //if successful response will be 'delete successful'
      await Book.deleteOne({ _id: bookid });
      res.send('delete successful');
    });
};
