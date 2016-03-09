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

router.get('/findNeighbours', function (req, res, next) {
    var radius = 10;
    Profile.findOne({_id: req.session.userId}, function (err, myProfil) {
        if (err) throw err;
        if (myProfil) {
            var latmin = myProfil.lattitude - 0.01;
            var latmax = myProfil.lattitude + 0.01;
            var lngmin = myProfil.longitude - 0.01;
            var lngmax = myProfil.longitude + 0.01;
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
            }, function (err, neighbours) {
                if (err) throw err;
                console.log(JSON.stringify(neighbours));
                res.render('findPeople', {title: 'Find Neighbours', neighbours: neighbours});
            });
        }
        else
            res.redirect('/');
    });

});

router.post('/login', profile.login);
router.post('/logout', profile.logout);
router.get('/register', profile.register);
router.post('/register', profile.register);

module.exports = router;
