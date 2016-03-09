require('../models/Request');

var mongoose = require("mongoose"),
    Request = mongoose.model('Request');

var Requests = {
    newRequest: function (req, res) {
        if(req.method == "GET"){

        }
        else if(req.method == "POST"){

        }
    },
    updateRequest: function (req, res) {
        res.redirect("/");
    },
    deleteRequest: function (req, res) {
        Request.findOne({user: req.session.userId}, function (err, request) {
            if (err)throw err;
            if (request) {
                delete request;
            }
            res.redirect('/profil/' + req.session.userId);
        });
    }
};

module.exports = Requests;