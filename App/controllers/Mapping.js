require('../models/Profile');

var mongoose = require("mongoose"),
    Profile = mongoose.model('Profile'),
    validator = require("validator");

var http = require("https");

var Mapping = {
    findNeighbours: function (req, res) {
        var radius = 0.01;
        if (req.params.radius !== undefined && validator.isInt(req.params.radius)) {
            radius = req.params.radius;
        }
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
                    res.render('Mapping/findPeople', {title: 'Find Neighbours', neighbours: neighbours});
                });
            }
            else
                res.redirect('/');
        });
    },
    apiFindNeighbours: function (req, res) {
        var radius = 0.01;
        if(req.params.radius !== undefined && validator.isInt(req.params.radius))
            radius = req.params.radius;
        Profile.findOne({_id: req.session.userId}, function (err, myProfil) {
            if (err) next(err);
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
                            available: true
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
                    if (err) next(err);
                    var resJson = { me : myProfil, neighbours:neighbours};
                    res.status(200).json(resJson).end();
                });
            }
            else
                res.status(204).send("No content").end();
        });
    }
};


module.exports = Mapping;