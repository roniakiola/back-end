"use strict";
const { validationResult } = require("express-validator");
// postController
const {
  getAllPosts,
  getPost,
  addPost,
  modifyPost,
  deletePost,
} = require("../models/postModel");
const { httpError } = require("../utils/errors");
const { makeThumbnail } = require("../utils/resize");

const post_list_get = async (req, res, next) => {
  try {
    const posts = await getAllPosts(req.params.id, next);
    if (posts.length > 0) {
      res.json(posts);
    } else {
      next("No posts found", 404);
    }
  } catch (e) {
    console.log("post_list_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const post_get = async (req, res, next) => {
  try {
    const vastaus = await getPost(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError("No post found", 404));
    }
  } catch (e) {
    console.log("post_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const post_post = async (req, res, next) => {
  console.log("post_post", req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("post_post validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }

  try {
    let tiedosto = "";
    if (req.file) {
      await makeThumbnail(req.file.path, "./thumbnails/" + req.file.filename);
      tiedosto = req.file.filename;
    }

    const { title, content, category } = req.body;

    const tulos = await addPost(
      title,
      content,
      tiedosto,
      req.user.id,
      category,
      next
    );

    if (tulos.affectedRows > 0) {
      res.json({
        message: "post added",
        post_id: tulos.insertId,
      });
    } else {
      next(httpError("No post inserted", 400));
    }
  } catch (e) {
    console.log("post_post error", e.message);
    next(httpError("internal server error", 500));
  }
};

const post_put = async (req, res, next) => {
  console.log("post_put", req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("post_put validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }
  // pvm VVVV-KK-PP esim 2010-05-28
  try {
    const { title, content } = req.body;
    // let owner = req.user.user_id;
    // if (req.user.role === 0) {
    //   owner = req.owner.body;
    // }

    const owner = req.user.role === 1 ? req.body.owner : req.user.id;

    const tulos = await modifyPost(
      title,
      content,
      req.params.id,
      req.user.role,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: "post modified",
        id: tulos.insertId,
      });
    } else {
      next(httpError("No post modified", 400));
    }
  } catch (e) {
    console.log("post_put error", e.message);
    next(httpError("internal server error", 500));
  }
};

const post_delete = async (req, res, next) => {
  try {
    const vastaus = await deletePost(
      req.params.id,
      req.user.id,
      req.user.role,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: "post deleted",
        id: vastaus.insertId,
      });
    } else {
      next(httpError("No post found", 404));
    }
  } catch (e) {
    console.log("post_delete error", e.message);
    next(httpError("internal server error", 500));
  }
};

module.exports = {
  post_list_get,
  post_get,
  post_post,
  post_put,
  post_delete,
};