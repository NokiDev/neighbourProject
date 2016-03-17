var express = require('express');
var router = express.Router();
var profile = require('../controllers/Profiles');
var mapping = require('../controllers/Mapping');
var isAuthenticated = require('../middlewares/Auth').apiIsAuthenticated;
/**API appli mobile **/

router.get('/findNeighbours/:radius', isAuthenticated, mapping.apiFindNeighbours);
router.post('/login', profile.auth);
router.get('/logout', profile.auth);
router.post('/profile-create', profile.create);
router.get('/profile/:id',isAuthenticated, profile.get);
router.put('/profile-update/:id',isAuthenticated,  profile.put);

module.exports = router;
