'use strict';
// categoryRoute
const express = require('express');
const {
  category_list_get,
  category_get,
} = require('../controllers/categoryController');
const router = express.Router();

router.route('/').get(category_list_get);

router.route('/:id').get(category_get);

module.exports = router;