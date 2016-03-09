require('../models/Request');

var mongoose = require("mongoose"),
    Request = mongoose.model('Request');

var Requests = {
    index : function (req, res){
        res.render('indexRequest')
    },
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
        res.redirect("/");
    }
};

module.exports = Requests;