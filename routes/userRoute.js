"use strict";
// userRoute
const express = require("express");
// const { body } = require("express-validator");
// const multer = require("multer");
const {
  user_list_get,
  user_get,
  // user_post,
  user_delete,
  checkToken,
} = require("../controllers/userController");
const router = express.Router();

router.get("/token", checkToken);

router.get("/", user_list_get);

// router.get("/:id", user_get);

// router.delete(user_delete);
router.route("/:id").get(user_get).delete(user_delete);
// .put(
//   body("title").notEmpty().escape(),
//   body("content").notEmpty().escape,
//   post_put
// );

module.exports = router;
