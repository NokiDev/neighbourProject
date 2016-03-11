var express = require('express');
var router = express.Router();

var profile = require('../controllers/Profiles')

var authenticate = function(req, res, next){
    if(req.session.isAuthenticated == true)
        next();
    else
        res.redirect('../login');
};

router.get('/:id', authenticate, profile.index);
router.get('/', authenticate, profile.index);
router.get('/update', authenticate, profile.updateInfos);
router.post('/update', authenticate, profile.updateInfos);
router.post('/available', authenticate, profile.updateAvailable);

module.exports = router;