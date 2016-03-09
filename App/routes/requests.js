var express = require('express');
var router = express.Router();

var request = require('../controllers/Requests');

var authenticate = function(req, res, next){
    if(req.session !== undefined)
        next();
    else
        res.redirect('../');
};

router.get('/', request.index);
router.post('/create-request', request.newRequest);
router.get('/create-request', authenticate, request.newRequest);
router.post('/update-request', authenticate, request.updateRequest);
router.post('/delete-request', authenticate, request.deleteRequest);

module.exports = router;