var express = require('express');
var router = express.Router();
require('../models/Profile');
var mongoose = require("mongoose"),
    Profile = mongoose.model('Profile');
var profile = require('../controllers/Profiles');

var http = require('https');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/findNeighbours', function (req, res) {
    var radius = 0.01;
    if(req.params.radius !== undefined)
        radius = req.params.radius;
    Profile.findOne({_id: req.session.userId}, function (err, myProfil) {
        if (err) throw err;
        if (myProfil) {
            var latmin = myProfil.lattitude - radius;
            var latmax = myProfil.lattitude + radius;
            var lngmin = myProfil.longitude - radius;
            var lngmax = myProfil.longitude + radius;
            Profile.find({
                $and: [{
                    _id: {$ne: req.session.userId}
                },
                    {
                        $and: [{
                            longitude: {$gte: lngmin}
                        }, {longitude: {$lte: lngmax}}
                        ]
                    },
                    {
                        $and: [{
                            lattitude: {$gte: latmin}
                        },
                            {lattitude: {$lte: latmax}}
                        ]
                    }]
            }, "_id last_name first_name email address avatarLink note noticesNb", function (err, neighbours) {
                if (err) throw err;
                res.render('findPeople', {title: 'Find Neighbours', neighbours: neighbours});
            });
        }
        else
            res.redirect('/');
    });
});

router.post('/login', profile.login);
router.get('/login', profile.login);
router.get('/logout', profile.logout);
router.get('/register', profile.register);
router.post('/register', profile.register);

module.exports = router;
