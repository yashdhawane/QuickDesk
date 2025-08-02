const express = require('express');
const userRouter = express.Router();
const UserController = require('../controller/UserController');
const authMiddleware = require('../middleware/authmiddleware');

// GET /users
userRouter.get('/', (req, res) => {
  res.send('List of users');
});

userRouter.post('/register', UserController.registerUser);
userRouter.post('/login', UserController.login);
userRouter.post('/createTicket', authMiddleware,UserController.createTicket);
userRouter.post('/createTagCategory', UserController.createTagCategory);
userRouter.post('/assignTicket/:id', authMiddleware, UserController.assignTicket);
userRouter.post('/changerole', authMiddleware, UserController.requestRoleChange);
userRouter.get('/getAllTickets', UserController.getAllTickets);
userRouter.post('/updateTicketStatus', authMiddleware, UserController.updateTicketStatus);
userRouter.get('/getAllTags', UserController.getAllTags);

module.exports = userRouter;
