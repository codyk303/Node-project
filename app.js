let express = require('express');
let app = express();
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let mongoose = require("mongoose");
let passport = require("passport");
let passportLocal = require("passport-local");
let passportLocalMongoose = require("passport-local-mongoose");
let Camp = require("./models/campground");
let Comment = require("./models/comment");
let User = require("./models/user");
let seedDB = require("./seeds");
let flash = require("connect-flash");

let commentRoutes = require("./routes/comments");
let campgroundRoutes = require("./routes/campgrounds");
let authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_app",{useNewUrlParser:true});


app.use(require("express-session")({
  secret:"I am really good at this",
  resave: false,
  saveUninitialized:false
}));

// seedDB();//Seeding DB
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);
app.use(authRoutes);

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.listen(3000, process.env.IP, function(){
  console.log('Yelpcamp Server has started!');
});
