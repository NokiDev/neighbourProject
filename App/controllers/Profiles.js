require('../models/Profile');
require('../models/Request');
require('../models/Review');

async = require('async');

var mongoose = require("mongoose"),
    Profile = mongoose.model('Profile'),
    Request = mongoose.model('Request'),
    Review = mongoose.model('Review'),
    removeDiacritics = require("diacritics").remove,
    validator = require("validator"),
    http = require("https");

var Profiles = {
    index: function (req, res, next) {
        ///Display profil page
        var id = req.session.userId;
        if (req.params.id !== undefined)
            id = req.params.id;
        async.waterfall(
            [
                function(callback){
                    Profile.findOne({_id:id}, "first_name last_name email address city birthDate avatarLink available longitude lattitude note noticesNb", function(err,profile){
                        if(profile)
                            callback(err, profile);
                        else{
                            err = Error("NotFound");
                            err.statusCode=404;
                            next(err);
                        }
                    });
                },
                function(profile, callback){
                    Request.findOne({user:id}, "_id description date createdOn nbPeople urgent longitude lattitude", function(err, requests){callback(err, profile, requests)});
                },
                function(profile, requests){
                    res.render('Profile/index', {title: "Profile", profile: profile, requests: requests});
                }
            ],
            function(err){res.redirect('../')}
        );
    },
    updateInfos: function (req, res) {
        ///Update done redirect to profil
        Profile.findOne({_id: req.session.userId}, function (err, profile) {
            if (profile) {
                if (req.method == "GET") {
                    ///Display register form
                    res.render('Profile/update', {
                        title: "Update",
                        values: profile
                    });
                }
                else if (req.method == "POST") {
                    ///API KEY :  AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI
                    // Request Exemple : https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key= AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI
                    var address = req.body.address;
                    address = removeDiacritics(address)
                    var addressFormatedUrl = address.replace(/\s/g, "+"); //Change space into '+'
                    var url = '/maps/api/geocode/json?address=+' + addressFormatedUrl + ',+' + req.body.city + ',+' + req.body.postalCode + '&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI';
                    ////GOOGLE API REQUEST FOR CONVERT ADRESS TO LAT AND LONG
                    var options = {
                        host: "maps.googleapis.com",
                        path: url
                    };
                    var datas = '';
                    var errors = {};
                    var callback = function (response) {
                        response.setEncoding('utf8');
                        response.on('data', function (chunk) {
                            datas += chunk;
                        });
                        response.on('end', function () {
                            datas = JSON.parse(datas);
                            if (datas.status != "OK") {
                                errors.location = "Your location doesn't exist";
                            }
                            if (req.body.password === undefined || req.body.passwordConfirm === undefined) {
                                errors.password = "Please fill this field";
                            }
                            else if (req.body.password != req.body.passwordConfirm) {
                                errors.password = "Your passwords doesn't match";
                                req.body.password = "";
                                req.body.passwordConfirm = "";
                            }
                            var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                            if (req.body.email !== undefined) {
                                if (regexEmail.test(req.body.email)) {
                                    //FIXME Need a Promise here
                                    Profile.findOne({'email': req.body.email}, function (err, user) {
                                        if (err) throw err;
                                        if (user)
                                            errors.email = "Emails unavailable";
                                    });
                                }
                                else {
                                    errors.email = "Email's format non valid"
                                    req.body.email = "";
                                }
                            }
                            else {
                                errors.mail = "Please fill this field"
                            }
                            if (req.body.last_name === undefined) {
                                errors.last_name = "Please fill this field"
                            }
                            if (req.body.first_name === undefined) {
                                errors.first_name = "Please fill this field"
                            }
                            if (Object.keys(errors).length > 0) {
                                res.render('Profile/update', {values: profile, errors: errors})
                            }
                            else {
                                var location = datas.results[0].geometry.location;
                                var addressComponents = datas.results[0].address_components;
                                profile.first_name = req.body.first_name;
                                profile.first_name = req.body.last_name;
                                profile.email = req.body.email;
                                profile.password = req.body.password;
                                profile.address = req.body.address;
                                profile.city = req.body.city;
                                profile.region = req.body.region;
                                profile.country = req.body.country;
                                profile.postalCode = req.body.postalCode;

                                profile.save(function (err) {
                                    if (err) throw(err);
                                    res.redirect('/profile/' + profile._id);
                                });
                            }
                        });
                    };
                    http.request(options, callback).on("error", function (err) {
                        console.log(err.message)
                    }).end();
                }
            }
        });
    },
    updateAvailable: function (req, res) {
        async.waterfall(
            [
                function(cb) {
                    Profile.findOne({_id: req.session.userId}, function(err, profile){cb (err, profile)});},
                function(profile, callback){
                    if(profile) {
                        profile.available = req.body.available == "on";
                        profile.save(function(err){callback(err,profile)});
                    }
                    else{
                        var err = "Not Found";
                        err.status = 404;
                        callback(err);
                    }
                },
                function(profile, callback){
                    res.redirect('profile/');
                }
            ],
            function(err){next(err)}
        );
        /*function findCb(err, profile){
            if(err) throw err;
            if (profile) {
                profile.available = req.body.available == "on";
                profile.save(function (err) {
                    if (err) throw(err);
                    res.redirect('profile/');
                })
            }
            else{
                var err = new Error('Not Found');
                err.status = 404;
                throw err;
            }
        }

        Profile.findOne({_id: req.session.userId})
            .then(findCb)
            .catch(function(err){ console.log(err) });*/
    },
    giveNote : function(req, res){
        async.waterfall(
            [
                function(callback){
                    Reviews.findOne({from_user : req.session.userId, forUser : req.body.userId}, function(err, review){callback(err,review);})
                },
                function(review, callback){
                    if(review){
                        review.note = req.body.note;
                        review.description = req.body.description;
                    }else{
                        review = new Review({
                            note : req.body.note,
                            description : req.body.description,
                            forUser : req.body.userId,
                            fromUser : req.session.userId
                        });
                    }
                    review.save(callback(err));
                },
                function(callback){
                    Review.find({forUser : req.body.userId}, function(err, reviews){callback(err, reviews);})
                },
                function(reviews, callback){
                    var average = 0;
                    var i;
                    for(review in reviews){
                        average += reviews.note;
                        i++;
                    }
                    average /= i;
                    Profile.findOne({_id: req.body.userId}, function(err, profile){callback(err, average, i, profile)});
                },
                function(average, count, profile, callback){
                    profile.noteAvg = average;
                    profile.reviewsNb = count;
                    profile.save(callback(err));
                },
                function(){
                    res.redirect('/profile');
                }
            ],
            function(err){res.redirect('/')}
        )
    },
    register: function (req, res) {
        if (req.method == "GET") {
            ///Display register form
            res.render('Profile/register', {
                title: "Register",
                values: {last_name: "", first_name: "", email: "", address: "", city: "", postalCode: ""}
            });
        }
        else if (req.method == "POST") {

            ///API KEY :  AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI
            // Request Exemple : https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key= AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_ve
            var address = removeDiacritics(req.body.address);
            var addressFormatedUrl = address.replace(/\s/g, "+"); //Change space into '+'
            var url = '/maps/api/geocode/json?address=+' + addressFormatedUrl + ',+' + req.body.city + ',+' + req.body.postalCode + '&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI';
            ////GOOGLE API REQUEST FOR CONVERT ADRESS TO LAT AND LONG

            var options = {
                host: "maps.googleapis.com",
                path: url
            };

            var datas = '';
            var errors = {};
            async.waterfall(
                [
                    function(callback){
                        http.request(options, function(response){callback(response)})
                    },
                    function(response, callback){
                        response.setEncoding('utf8');
                        response.on('data', function(chunk){
                            datas+=chunk;
                        });
                        response.on('end', callback)
                    },
                    function(){
                        datas = JSON.parse(datas);
                        if (datas.status != "OK" || datas.results[0].address_components[6] === undefined) {
                            errors.location = "Your location doesn't exist";
                        }
                        if (req.body.password === undefined || req.body.passwordConfirm === undefined) {
                            errors.password = "Please fill this field";
                        }
                        else if (req.body.password != req.body.passwordConfirm) {
                            errors.password = "Your passwords doesn't match";
                            req.body.password = "";
                            req.body.passwordConfirm = "";
                        }

                        if (req.body.last_name === undefined) {
                            errors.last_name = "Please fill this field"
                        }
                        if (req.body.first_name === undefined) {
                            errors.first_name = "Please fill this field"
                        }
                        if (req.body.email !== undefined) {
                            if (validator.isEmail(req.body.email)) {
                                //FIXME CallbackHell
                                Profile.findOne({'email': req.body.email}, function (err, user) {
                                    if (err) throw err;
                                    if (user) {
                                        errors.mail = "Emails unavailable";
                                        res.render('Profile/register', {values: req.body, errors: errors});
                                    }
                                    else {
                                        var location = datas.results[0].geometry.location;
                                        var addressComponents = datas.results[0].address_components;
                                        var profile = new Profile({
                                            first_name: req.body.first_name,
                                            last_name: req.body.last_name,
                                            email: req.body.email,
                                            password: req.body.password,
                                            address: addressComponents[0].long_name + ' ' + addressComponents[1].long_name,
                                            city: addressComponents[3].long_name,
                                            region: addressComponents[4].long_name,
                                            country: addressComponents[5].long_name,
                                            postalCode: addressComponents[6].long_name,
                                            lattitude: location.lat,
                                            longitude: location.lng
                                        });
                                        profile.save(function (err) {
                                            if (err) throw(err);
                                            req.session.userId = profile._id;
                                            req.session.isAuthenticated = true;
                                            res.redirect('profile/');
                                        });
                                    }
                                });
                            }
                            else {
                                errors.mail = "Email's format non valid"
                                req.body.mail = "";
                            }
                        }
                        else {
                            errors.mail = "Please fill this field"
                        }
                        if (Object.keys(errors).length > 0) {
                            res.render('Profile/register', {values: req.body, errors: errors});
                        }
                    },
                ],
                function(err){res.render('Profile/register', {values: req.body, errors: errors});}
            );
           /* var callback = function (response) {
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    datas += chunk;
                });
                response.on('end', function () {
                    datas = JSON.parse(datas);
                    if (datas.status != "OK" || datas.results[0].address_components[6] === undefined) {
                        errors.location = "Your location doesn't exist";
                    }
                    if (req.body.password === undefined || req.body.passwordConfirm === undefined) {
                        errors.password = "Please fill this field";
                    }
                    else if (req.body.password != req.body.passwordConfirm) {
                        errors.password = "Your passwords doesn't match";
                        req.body.password = "";
                        req.body.passwordConfirm = "";
                    }

                    if (req.body.last_name === undefined) {
                        errors.last_name = "Please fill this field"
                    }
                    if (req.body.first_name === undefined) {
                        errors.first_name = "Please fill this field"
                    }
                    if (req.body.email !== undefined) {
                        if (validator.isEmail(req.body.email)) {
                            //FIXME CallbackHell
                            Profile.findOne({'email': req.body.email}, function (err, user) {
                                if (err) throw err;
                                if (user) {
                                    errors.mail = "Emails unavailable";
                                    res.render('Profile/register', {values: req.body, errors: errors});
                                }
                                else {
                                    var location = datas.results[0].geometry.location;
                                    var addressComponents = datas.results[0].address_components;
                                    var profile = new Profile({
                                        first_name: req.body.first_name,
                                        last_name: req.body.last_name,
                                        email: req.body.email,
                                        password: req.body.password,
                                        address: addressComponents[0].long_name + ' ' + addressComponents[1].long_name,
                                        city: addressComponents[3].long_name,
                                        region: addressComponents[4].long_name,
                                        country: addressComponents[5].long_name,
                                        postalCode: addressComponents[6].long_name,
                                        lattitude: location.lat,
                                        longitude: location.lng
                                    });
                                    profile.save(function (err) {
                                        if (err) throw(err);
                                        req.session.userId = profile._id;
                                        req.session.isAuthenticated = true;
                                        res.redirect('profile/');
                                    });
                                }
                            });
                        }
                        else {
                            errors.mail = "Email's format non valid"
                            req.body.mail = "";
                        }
                    }
                    else {
                        errors.mail = "Please fill this field"
                    }
                    if (Object.keys(errors).length > 0) {
                        res.render('Profile/register', {values: req.body, errors: errors});
                    }
                });
            };
            http.request(options, callback).end();*/
        }
    },
    login: function (req, res) {
        if (req.method == "GET")
            res.render('Profile/login', {title: "Login", values: {email: ""}});
        else if (req.method == "POST") {
            async.waterfall(
                [
                    function(callback){
                        Profile.findOne({email:req.body.email}, function(err, profile){callback(err, profile)})
                    },
                    function(profile, callback){
                        if(profile){
                            profile.comparePassword(req.body.password, function (err, isMatch){ callback(err, isMatch, profile)})
                        }
                        else
                            callback(Error("Wrong mail or password"));
                    },
                    function(isMatch, profile, callback){
                        if (isMatch){
                            req.session.isAuthenticated = true;
                            req.session.userId= profile.id;
                            res.redirect('/profile');
                        }
                        else
                            callback(Error("Wrong mail or password"));
                    }
                ],
                function(err){
                    res.render("Profile/login", {title: "Login", values: {email: req.body.email}, error: err});
                }
            );
            /*Profile.findOne({email: req.body.email})
                .then(function (err, profile) {
                    if (profile) {
                        profile.comparePassword(req.body.password, function (err, isMatch) {
                            if (isMatch) {
                                req.session.isAuthenticated = true;
                                req.session.userId = profile.id;
                                res.redirect('/profile');
                            }
                            else {
                                throw Error("Wrong Email or Password");
                            }
                        });
                    } else {
                        throw Error("Wrong Email or Password")
                    }
                })
                .catch(function (err) {
                    res.render("Profile/login", {title: "Login", values: {email: req.body.email}, error: err});
                });*/
        }
    },
    logout: function (req, res) {
        delete req.session.isAuthenticated;
        delete req.session.userId;
        res.redirect('/')
    },

    get: function (req, res) {
        Profile.findOne({}, "_id first_name last_name email address city birthDate avatarLink available note noticesNb", function (err, profile) {
            if (profile) {
                var infos = {profile: profile};
                Request.find({user: req.params.id}, "_id description date createdOn nbPeople urgent longitude lattitude", function (err, requests) {
                    infos.requests = requests;
                    res.status(200).json(infos).end();
                });
            }
            else
                res.status(204).send('No content').end();
        });
    },
    createProfile: function (req, res) {
        ///API KEY :  AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI
        // Request Exemple : https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key= AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI
        var address = req.body.address;
        address = removeDiacritics(address);
        var addressFormatedUrl = address.replace(/\s/g, "+"); //Change space into '+'
        var url = '/maps/api/geocode/json?address=+' + addressFormatedUrl + ',+' + req.body.city + ',+' + req.body.postalCode + '&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI';
        ////GOOGLE API REQUEST FOR CONVERT ADRESS TO LAT AND LONG
        var options = {
            host: "maps.googleapis.com",
            path: url
        };
        var datas = '';
        var errors = {};
        var callback = function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                datas += chunk;
            });
            response.on('end', function () {
                datas = JSON.parse(datas);
                if (datas.status != "OK" || datas.results[0].address_components[6] === undefined) {
                    errors.location = "Your location doesn't exist";
                }
                if (req.body.password === undefined || req.body.passwordConfirm === undefined) {
                    errors.password = "Please fill this field";
                }
                else if (req.body.password != req.body.passwordConfirm) {
                    errors.password = "Your passwords doesn't match";
                    req.body.password = "";
                    req.body.passwordConfirm = "";
                }
                var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                if (req.body.last_name === undefined) {
                    errors.last_name = "Please fill this field"
                }
                if (req.body.first_name === undefined) {
                    errors.first_name = "Please fill this field"
                }
                if (req.body.email !== undefined) {
                    if (regexEmail.test(req.body.email)) {
                        //FIXME CallbackHell
                        Profile.findOne({'email': req.body.email}, function (err, user) {
                            if (err) throw err;
                            if (user) {
                                errors.mail = "Emails unavailable";
                                res.render('register', {values: req.body, errors: errors});
                            }
                            else {
                                var location = datas.results[0].geometry.location;
                                var addressComponents = datas.results[0].address_components;
                                var profile = new Profile({
                                    first_name: req.body.first_name,
                                    last_name: req.body.last_name,
                                    email: req.body.email,
                                    password: req.body.password,
                                    address: addressComponents[0].long_name + ' ' + addressComponents[1].long_name,
                                    city: addressComponents[3].long_name,
                                    region: addressComponents[4].long_name,
                                    country: addressComponents[5].long_name,
                                    postalCode: addressComponents[6].long_name,
                                    lattitude: location.lat,
                                    longitude: location.lng
                                });
                                profile.save(function (err) {
                                    if (err) throw(err);
                                    req.session.userId = profile._id;
                                    req.session.isAuthenticated = true;
                                    res.status(201).send("Content Created").end();
                                });
                            }
                        });
                    }
                    else {
                        errors.mail = "Email's format non valid"
                        req.body.mail = "";
                    }
                }
                else {
                    errors.mail = "Please fill this field"
                }
                if (Object.keys(errors).length > 0) {
                    var resJson = {};
                    resJson.errors = errors;
                    resJson.values = req.body;
                    res.status(412).json(resJson).end();
                }
            });
        };
        http.request(options, callback).on("error", function (err) {
            console.log(err.message)
        }).end();
    },
    auth: function (req, res) {
        if (req.method == "GET") {
            delete req.session.isAuthenticated;
            delete req.session.userId;
            res.status(200).send("Log out done !").end();
        }
        else if (req.method == "POST") {
            Profile.findOne({email: req.body.email}, function (err, profile) {
                if (err)throw(err);
                if (profile) {
                    profile.comparePassword(req.body.password, function (err, isMatch) {
                        if (err) throw(err);
                        if (isMatch) {
                            req.session.isAuthenticated = true;
                            req.session.userId = profile._id;
                            res.status(200).send("Auth Complete").end();
                        }
                        else {
                            res.status(204).send("No Content").end();
                        }
                    });
                }
                else
                    res.status(204).send("No Content").end();
            });
        }
    },
    put: function (req, res) {

    }
};

module.exports = Profiles;