"use strict";
const { user_get } = require("../controllers/userController");
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllPosts = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT
       post.id, 
       title,
       content,
       post.img,
       post.created,
       post.category,
       post.owner,
       user.username AS ownername
       FROM post 
       JOIN user
       ON post.owner = user.id
       INNER JOIN category 
       ON post.category = category.id 
       WHERE post.parent IS NULL 
       AND category.id = ?
       ORDER BY created DESC`, [id]);
    return rows;
  } catch (e) {
    console.error("getAllPosts error", e.message);
    next(httpError("Database error", 500));
  }
};

const getPost = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `
      SELECT 
      post.id,
      title, 
      content, 
      post.img,
      post.created,
      post.category,
      owner, 
      parent, 
      user.username as ownername
      FROM post 
      JOIN user ON
      post.owner = user.id
	    WHERE post.id = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const addPost = async (title, content, img, owner, category, next) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO post (title, content, img, owner, category) VALUES (?, ?, ?, ?, ?)",
      [title, content, img, owner, category]
    );
    return rows;
  } catch (e) {
    console.error("addPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const modifyPost = async (title, content, img, id, role, next) => {
  let sql =
    "UPDATE post SET title = ?, content = ?, img = ? WHERE id = ? AND owner = ?;";
  let params = [title, content, img, id, owner];
  if (role === 0) {
    sql =
      "UPDATE post SET title = ?, content = ?, img = ? WHERE id = ? AND owner = ?;";
    params = [title, content, img, id, owner];
  }
  console.log("sql", sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("addPost error", e.message);
    next(httpError("Database error", 500));
  }
};

const deletePost = async (id, owner_id, role, next) => {
  let sql = "DELETE FROM post WHERE id = ? AND owner = ?";
  let params = [id, owner_id];
  if (role === 1) {
    sql = "DELETE FROM post WHERE id = ?";
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("deletePost error", e.message);
    next(httpError("Database error", 500));
  }
};

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  modifyPost,
  deletePost,
};
