const express = require('express');
const userRouter = express.Router();
const UserController = require('../controller/UserController');

// GET /users
userRouter.get('/', (req, res) => {
  res.send('List of users');
});

userRouter.post('/register', UserController.registerUser);



module.exports = userRouter;
