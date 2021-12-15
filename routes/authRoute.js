"use strict";
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { login, user_post } = require("../controllers/authController");

router.post("/login", login);

router.post(
  "/register",
  body("username").isLength({ min: 3 }).escape(),
  body("email").isEmail(),
  body("password").isLength({ min: 4 }).escape(),
  user_post
);

module.exports = router;
