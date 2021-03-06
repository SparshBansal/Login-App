var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require('passport');
var setupPassport = require('./setupPassport');

var routes = require("./routes");

var app = express();

mongoose.connect("mongodb://localhost:27017/test");
setupPassport();
app.set("port" , process.env.PORT || 3000);

app.set("view engine" , "ejs");
app.set("views" , path.resolve(__dirname , "views"));

app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.listen(app.get("port") , function(){
  console.log("App started on port : " + app.get("port"));
});
