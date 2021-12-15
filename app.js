"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute");
const passport = require("./utils/pass");
const { httpError } = require("./utils/errors");

const app = express();
const port = 3000;
app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static("./uploads/"));
app.use("/thumbnails", express.static("thumbnails"));

app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/post", passport.authenticate("jwt", { session: false }), postRoute);
app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);
app.use('/category', passport.authenticate("jwt", { session: false }), categoryRoute);

app.use((req, res, next) => {
  const err = httpError("Not found", 404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "internal server error (app.js)",
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
