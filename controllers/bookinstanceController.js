var BookInstance = require("../models/bookinstance");
var Book = require("../models/book");
var async = require("async");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
  BookInstance.find()
    .populate("book")
    .exec(function(err, list) {
      if (err) {
        return next(err);
      }
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list
      });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function(err, bookinstance) {
      if (err) {
        return next(err);
      }

      if (bookinstance == null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }

      res.render("bookinstance_detail", {
        title: bookinstance.book.title,
        bookinstance: bookinstance
      });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, "title").exec(function(err, books) {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
      selected_book: "",
      errors: "",
      bookinstance: ""
    });
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book", "Book must be specified")
    .isLength({ min: 1 })
    .trim(),
  body("imprint", "Imprint must be specified")
    .isLength({ min: 1 })
    .trim(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody("book")
    .trim()
    .escape(),
  sanitizeBody("imprint")
    .trim()
    .escape(),
  sanitizeBody("status")
    .trim()
    .escape(),
  sanitizeBody("due_back").toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function(err, books) {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance
        });
      });
    } else {
      bookinstance.save(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect(bookinstance.url);
      });
    }
  }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("author")
    .populate("book")
    .exec(function(err, results) {
      if (results == null) {
        res.redirect("/catalog/bookinstances");
      }
      res.render("bookinstance_delete", {
        title: "Delete Bookinstance",
        bookinstances: results
      });
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("author")
    .populate("book")
    .exec(function(err, results) {
      if (err) {
        return next(err);
      }

      BookInstance.findByIdAndRemove(
        req.body.bookinstanceid,
        function deleteBookinstance(err) {
          if (err) {
            return next(err);
          }

          res.redirect("/catalog/bookinstances");
        }
      );
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
  async.parallel(
    {
      bookinstance: function(callback) {
        BookInstance.findById(req.params.id)
          .populate("book")
          .exec(callback);
      },
      book_list: function(callback) {
        Book.find(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.bookinstance == null) { 
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_form", {
        title: "Update Bookinstance",
        selected_book: results.bookinstance.book._id,
        book_list: results.book_list,
        bookinstance: results.bookinstance,
        errors: ""
      });
    }
  );
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body("book", "Book must be specified")
    .isLength({ min: 1 })
    .trim(),
  body("imprint", "Imprint must be specified")
    .isLength({ min: 1 })
    .trim(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody("book")
    .trim()
    .escape(),
  sanitizeBody("imprint")
    .trim()
    .escape(),
  sanitizeBody("status")
    .trim()
    .escape(),
  sanitizeBody("due_back").toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance
          
        });
      });
    } else {
      BookInstance.findOneAndUpdate(
        { _id: req.params.id },
        bookinstance,
        { new: true, returnOriginal: false },
        function (err, thebookinstance) {
          if (err) {
            return next(err);
          }
          res.redirect(thebookinstance.url);
        }
      );;
    }
  }
];