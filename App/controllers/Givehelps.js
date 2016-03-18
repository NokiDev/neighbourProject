require('../models/Givehelp');

var mongoose = require("mongoose"),
    Givehelp = mongoose.model('Givehelp');

var Givehelp = {
    newGivehelp: function (req, res) {
        if(req.method == "GET"){

        }
        else if(req.method == "POST"){

        }
    },
    updateGivehelp: function (req, res) {
        res.redirect("/");
    },
    deleteGivehelp: function (req, res) {
        Givehelp.findOne({user: req.session.userId}, function (err, givehelp) {
            if (err)throw err;
            if (givehelp) {
                delete givehelp;
            }
            res.redirect('/profil/' + req.session.userId);
        });
    }
};

module.exports = Givehelps;