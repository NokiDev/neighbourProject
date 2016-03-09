var express = require('express');
var router = express.Router();

var profile = require('../controllers/Profiles');

var http = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
    var options = {
        host : "maps.googleapis.com",
        path : '/maps/api/geocode/json?address=98+rue+de+la+Glaciere,+Paris,+75013&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI'
    };

    var datas = '';
    var req = function(res) {

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            datas += chunk;
        });

        res.on('end', function(){
            data = JSON.parse(datas);
            var location = data.results[0].geometry.location;
            var lattitude = location.lat;
            var longitude = location.lng;

            console.log("lattitude" + lattitude);
            console.log("longitude : " + longitude)
        });
    };

    http.request(options, req).end();


    //
// On Error
//
    /*
    req.on('error', function(e)
    {
        console.log('\n\n==========ERROR==============')
        console.log('problem with request: ' + e.message);
    });

    req.end();*/
    res.render('index', {title: 'Express'});
});

router.post('/login', profile.login);
router.post('/logout', profile.logout);
router.get('/register', profile.register);
router.post('/register', profile.register);

module.exports = router;
