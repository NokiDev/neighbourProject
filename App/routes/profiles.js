var express = require('express');
var router = express.Router();
var profile = require('../controllers/Profiles');
var isAuthenticated = require('../middlewares/Auth').isAuthenticated;

/*Get profile page of the specified id*/
router.get('/:id', isAuthenticated, profile.index);
/*Get my profile page*/
router.get('/', isAuthenticated, profile.index);
/*Get profile update page*/
router.get('/update', isAuthenticated, profile.updateInfos);
/*Change profile information*/
router.post('/update', isAuthenticated, profile.updateInfos);
/*Change status */
router.post('/available', isAuthenticated, profile.updateAvailable);

router.post('/giveNote', isAuthenticated, profile.giveNote);

module.exports = router;