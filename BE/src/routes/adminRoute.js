const express = require('express');
const adminRouter = express.Router();
const adminRoutes = require('../controller/adminController');

// GET /users
adminRouter.get('/', adminRoutes.getadmin);
adminRouter.get('/getTicketsCounts', adminRoutes.getTicketsCounts);
adminRouter.get('/getTicketCountPerUser',adminRoutes.getTicketCountPerUser);
adminRouter.post('/getTicketsFromLastXHours', adminRoutes.getTicketsFromLastXHours);
adminRouter.post('/getTicketCountsByInterval', adminRoutes.getTicketCountsByInterval);


module.exports = adminRouter;
