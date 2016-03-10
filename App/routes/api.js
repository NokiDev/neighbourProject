var express = require('express');
var router = express.Router();

var profile = require('../controllers/Profiles')

/**API appli mobile **/
var authenticate = function(req, res, next){
    if(req.session.isAuthenticated == true)
        next();
    else
        res.status(401).send("You need to authenticate").end();
};

router.get('/findNeighbours', authenticate, function(req, res, next){
    var radius = 0.01;
    if(req.params.radius !== undefined)
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
});

router.post('/login', profile.auth);
router.get('/logout', profile.auth);
router.post('/profile-create', profile.create);
router.get('/profile/:id', profile.get);
router.put('/profile-update/:id', profile.put);

module.exports = router;
