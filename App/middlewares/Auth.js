/**
 * Created by bluedragonfly on 3/11/16.
 */


var Auth = {
    isAuthenticated : function(req, res, next){
        if(req.session.isAuthenticated == true)
            next();
        else
            res.redirect('/login');
    },
    apiIsAuthenticated : function(req, res, next){
        if(req.session.isAuthenticated == true)
            next();
        else
            res.status(401).send("You need to authenticate").end();
    }
};


module.exports = Auth;