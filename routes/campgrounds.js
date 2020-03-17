let express = require("express");
let router = express.Router();
let Camp = require("../models/campground");



//Index Route
router.get("/",function(req,res){
  Camp.find({},function(err,camps){
    if(err){
      console.log("something broke");
      console.log(err);
    } else {
      res.render("campgrounds/index",{campground:camps});
    }
  });
});

//New Route
router.get("/new",isLoggedIn,function(req,res){

    res.render("campgrounds/new");
});

//Create Route
router.post("/" ,isLoggedIn, function(req,res){
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newCamp = {name:name,price:price,image:image,description:description,author:author};
  Camp.create(newCamp,function(err,camps){
    if(err){
      console.log("OH No!");
      console.log(err);
    } else {
      res.redirect("/campground");
    }
  });
});

//Show Route
router.get("/:id",function(req,res){

    Camp.findById(req.params.id).populate("comments").exec(function(err, campground){
      if(err){
        console.log(err);
      } else {
        console.log(campground);
        res.render("campgrounds/show",{campground:campground});
      }
    });
});

//edit route
router.get("/:id/edit",function(req,res){
  if(req.isAuthenticated()){
      Camp.findById(req.params.id,function(err,foundCamp){
        if(err){
          res.redirect("back");
        } else {
            if(foundCamp.author.id.equals(req.user._id)){
              res.render("campgrounds/edit",{foundcamp:foundCamp});
            } else {
              res.redirect("back");
            }
          }
      });
    } else {
        res.redirect("back");
  }


});

//update route
router.put("/:id",checkCampOwner,function(req,res){
  Camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
    if(err){
      res.redirect("/campground");
    } else {
      res.redirect("/campground/" + req.params.id);
    }
  });
});

//DEstroy Route
router.delete("/:id",checkCampOwner,function(req,res){
  Camp.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campground");
    } else {
      res.redirect("/campground");
    }
  });
});



//Middleware
function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please Log In First");
  res.redirect("/login");
}

function checkCampOwner(req,res,next){
  if(req.isAuthenticated()){
      Camp.findById(req.params.id,function(err,foundCamp){
        if(err){
          res.redirect("back");
        } else {
            if(foundCamp.author.id.equals(req.user._id)){
              next();
            } else {
              res.redirect("back");
            }
          }
      });
    } else {
        res.redirect("back");
  }

}


module.exports = router;
