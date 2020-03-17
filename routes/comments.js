let express = require("express");
let router = express.Router({mergeParams:true});
let Camp = require("../models/campground");
let Comment = require("../models/comment");


//===================
//Comments Route (nested)
//===================

router.get("/new",isLoggedIn,function(req,res){
    Camp.findById(req.params.id,function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new",{campground:campground});
      }
    });
});

router.post("/",isLoggedIn , function(req,res){
  Camp.findById(req.params.id,function(err, campground){
    if(err){
      console.log(err + "This is the finding ID err");
      res.redirect("/campground");
    } else {
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err + "this is the create err");
          res.redirect("/campground");
        } else {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campground/" + campground._id);
        }
      });
    }
  });

});

router.get("/:comment_id/edit",checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if(err){
        res.redirect("back");
      } else {
          res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
      }
    })
});

//update route
router.put("/:comment_id",checkCommentOwner,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campground/" + req.params.id);
    }
  });
});

//DEstroy Route
router.delete("/:comment_id",checkCommentOwner,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campground/" + req.params.id);
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

function checkCommentOwner(req,res,next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id,function(err,foundComment){
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
