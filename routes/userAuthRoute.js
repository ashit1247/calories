const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/login", function(req, res){
  res.render("login");
});

router.get("/register", function(req, res){
  res.render("register");
});

router.get("/logout", function(req, res){
  req.logout(function(){
    console.log("Successfully logged out.");
  });
  res.redirect("/");
});

router.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/meals");
      })
    }
  })
});

router.post("/register", function(req, res){
  User.register({username:req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/meals");
      })
    }
  })
});

module.exports = router;
