var express = require('express');
var router = express.Router();
var profile = require('../controllers/Profiles');
var mapping = require('../controllers/Mapping')
var isAuthenticated = require('../middlewares/Auth').isAuthenticated;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});



/*find neighbours arround the location of the connected user*/
router.get('/findNeighbours/:radius', isAuthenticated, mapping.findNeighbours);
/*Connect user*/
router.post('/login', profile.login);
/*Get login page*/
router.get('/login', profile.login);
/*Logout the user*/
router.get('/logout', profile.logout);
/*Get Register page*/
router.get('/register', profile.register);
/*Register a user in bdd*/
router.post('/register', profile.register);

module.exports = router;
