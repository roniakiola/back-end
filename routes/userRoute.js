'use strict';
// userRoute
const express = require('express');
const {
  user_list_get,
  user_get,
  user_delete,
  checkToken,
} = require('../controllers/userController');
const router = express.Router();

router.get('/token', checkToken);

router.get('/', user_list_get);

router.route('/:id').get(user_get).delete(user_delete);

module.exports = router;