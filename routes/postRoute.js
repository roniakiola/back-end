"use strict";
// postRoute
const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.filename) {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  cb(null, true);
};
const upload = multer({ dest: "./uploads/", fileFilter });
const {
  post_list_get,
  post_get,
  post_post,
  post_put,
  post_delete,
} = require("../controllers/postController");
const router = express.Router();

router
  .route("/:id")
  .get(post_list_get)
  .delete(post_delete)
  .post(
    upload.single("img"),
    body("title"),
    body("content").notEmpty().escape(),
    post_post
  );
router
  .route("/:id/:postid")
  .get(post_get)
  .put(
    body("title").notEmpty().escape(),
    body("content").notEmpty().escape(),
    post_put
  );

module.exports = router;