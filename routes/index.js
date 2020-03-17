let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

//Root
router.get("/",function(req, res){
  res.render("landing");
});


//===========================
//Auth Routes
//===========================

router.get("/register",function(req,res){
      res.render("register");
});

router.post("/register" , function(req,res){
  req.body.username;
  req.body.password;
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      req.flash("error",err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
      req.flash("success","You have successfully signed up! Welcome to YelpCamp " + user.username);
      res.redirect("/campground");
    });
  });
});


//===========================
//Login Routes
//===========================

router.get("/login",function(req,res){
      res.render("login");
});

router.post("/login" ,passport.authenticate("local",{
  successRedirect:"/campground",
  failureRedirect:"/register"
}), function(req,res){

});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You are now logged out!");
    res.redirect("/");
});

//Middleware
function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please Log In First");
  res.redirect("/login");
}

module.exports = router;
