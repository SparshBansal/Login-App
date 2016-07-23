var express = require('express');
var Users = require('./models/user');
var mRoutes = express.Router();

mRoutes.use(function(request , response , next){
  response.locals.currentUser = request.user;
  response.locals.errors = request.flash("error");
  response.locals.infos = request.flash("info");
  next();
});

mRoutes.get("/" , function(request , response , next){
  Users.find().sort({createdAt : "descending"}).exec(function(error , users){
    if(error) {next(error);}
    response.render("index" , {
      users : users
    });
  });
});

module.exports = mRoutes;
