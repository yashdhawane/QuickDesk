const express = require('express');
const adminRouter = express.Router();
const adminRoutes = require('../controller/adminController');
const adminMiddleware = require('../middleware/admin');


adminRouter.use(adminMiddleware)
adminRouter.get('/', adminRoutes.getadmin);
adminRouter.get('/getTicketsCounts', adminRoutes.getTicketsCounts);
adminRouter.get('/getTicketCountPerUser',adminRoutes.getTicketCountPerUser);
adminRouter.post('/getTicketsFromLastXHours', adminRoutes.getTicketsFromLastXHours);
adminRouter.post('/getTicketCountsByInterval', adminRoutes.getTicketCountsByInterval);
adminRouter.get('/getUsersWithTicketCount',adminRoutes.getUsersWithTicketCount);
adminRouter.get('/getSupportUsersWithTicketCount',adminRoutes.getSupportUsersWithTicketCount);
// adminRouter.post('/createTagCategory', adminRoutes.createTagCategory);
adminRouter.get('/getTicketsCountClosedByUser',adminRoutes.getTicketsCountClosedByUser);
adminRouter.get('/getAllUsers', adminRoutes.getAllUsers);
adminRouter.get('/getAllPendingRoleRequests', adminRoutes.getAllPendingRoleRequests);
adminRouter.post('/updateRoleRequestStatus', adminRoutes.updateRoleRequestStatus);



module.exports = adminRouter;
