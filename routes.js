var express = require('express');
var passport = require('passport');
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

mRoutes.get("/signup" , function(request , response , next){
  response.render("signup.ejs");
});

mRoutes.post("/signup" , function(request , response , next){
  var username = request.body.username;
  var password = request.body.password;

  Users.findOne( {username : username} , function(error , user){
    if(error){next(error)};
    if(user){
      request.flash("error" , "User already exists");
      return response.redirect("/signup");
    }

    var newUser = new Users({
      username : username,
      password : password
    });
    newUser.save(next);
  });
},passport.authenticate("login" , {
  successRedirect : "/",
  failureRedirect : "/signup",
  failureFlash : true
}));

mRoutes.get("/users/:username" , function(request , response , next){
  Users.findOne({username : request.params.username} , function(err , user){
    if(err){next(err)};
    if(!user){return next(404);}
    response.render("profile" , {
      user : user
    });
  });
});

mRoutes.get("/login" , function(request , response){
  response.render("login");
});

mRoutes.post("/login" , passport.authenticate("login" , {
  successRedirect : "/",
  failureRedirect : "/login",
  failureFlash : true
}));

mRoutes.get("/logout" , function(req, res){
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req , res , next){
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash("info" , "You must be logged in to see this page");
    res.redirect("/login");
  }
}

mRoutes.get("/edit" , ensureAuthenticated , function(req , res){
  res.render("edit");
});

mRoutes.post("/edit" , ensureAuthenticated , function(req , res , next){
  var bio = req.body.bio;
  var displayName = req.body.displayname;

  console.log("Display Name " , displayName , " Bio : " , bio);

  req.user.bio = bio;
  req.user.displayName = displayName;

  req.user.save(function(err){
    if(err){
      console.log("Error updating");
      next(err);
      return;
    }
    req.flash("info" , "Profile Updated");
    res.redirect("/edit");
  });
});

module.exports = mRoutes;
