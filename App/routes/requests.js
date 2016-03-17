var express = require('express');
var router = express.Router();
var request = require('../controllers/Requests');
var isAuthenticated = require('../middlewares/Auth').isAuthenticated;

/*Create a new request*/
router.post('/create-request', request.newRequest);
/*Get Page for create a request*/
router.get('/create-request', isAuthenticated, request.newRequest);
/*Update Request status*/
router.post('/update-request', isAuthenticated, request.updateRequest);
/*Delete Request*/
router.post('/delete-request', isAuthenticated, request.deleteRequest);

module.exports = router;