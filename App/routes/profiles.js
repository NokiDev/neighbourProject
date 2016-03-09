var express = require('express');
var router = express.Router();

var profile = require('../controllers/Profiles')

var authenticate = function(req, res, next){
    if(req.session !== undefined)
        next();
    else
        res.redirect('../');
};

router.get('/', authenticate, profile.index);
router.post('/update', authenticate, profile.update);

module.exports = router;