const express = require('express');
const adminRouter = express.Router();
const adminRoutes = require('../controller/adminController');

// GET /users
adminRouter.get('/', adminRoutes.getadmin);
adminRouter.get('/getTicketsCounts', adminRoutes.getTicketsCounts);
adminRouter.get('/getTicketCountPerUser',adminRoutes.getTicketCountPerUser);
adminRouter.post('/getTicketsFromLastXHours', adminRoutes.getTicketsFromLastXHours);
adminRouter.post('/getTicketCountsByInterval', adminRoutes.getTicketCountsByInterval);
adminRouter.get('/getUsersWithTicketCount',adminRoutes.getUsersWithTicketCount);
adminRouter.get('/getSupportUsersWithTicketCount',adminRoutes.getSupportUsersWithTicketCount);
// adminRouter.post('/createTagCategory', adminRoutes.createTagCategory);
adminRouter.get('/getTicketsCountClosedByUser',adminRoutes.getTicketsCountClosedByUser);




module.exports = adminRouter;
