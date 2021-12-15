'use strict';
// categoryController
const { validationResult } = require('express-validator');
const { getAllCategory, getCategory } = require('../models/categoryModel');
const { httpError } = require('../utils/errors');

const category_list_get = async (req, res, next) => {
  try {
    const categories = await getAllCategory(next);
    if (categories.length > 0) {
      res.json(categories);
    } else {
      next('No categories found', 404);
    }
  } catch (e) {
    console.log('category_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const category_get = async (req, res, next) => {
  try {
    const vastaus = await getCategory(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('No category found', 404));
    }
  } catch (e) {
    console.log('category_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  category_list_get,
  category_get,
};