const express = require('express');
const adminRouter = express.Router();
const { getadmin } = require('../controller/adminController');

// GET /users
adminRouter.get('/', getadmin);



module.exports = adminRouter;
