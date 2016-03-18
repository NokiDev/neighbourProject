var express = require('express');
var router = express.Router();
var givehelp = require('../controllers/Givehelps');
var isAuthenticated = require('../middlewares/Auth').isAuthenticated;

/*Create a new givehelp*/
router.post('/create-givehelp', givehelp.newRequest);
/*Get Page for create a givehelp*/
router.get('/create-givehelp', isAuthenticated, givehelp.newGivehelp);
/*Update Givehelp status*/
router.post('/update-givehelp', isAuthenticated, givehelp.updateGivehelp);
/*Delete Givehelp*/
router.post('/delete-givehelp', isAuthenticated, givehelp.deleteGivehelp);

module.exports = router;