const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Meal = require("../models/Meal");

//CREATE
router.get("/add", function(req, res){
  if(req.isAuthenticated()){
    res.render('add');
  }else{
    res.redirect("/login");
  }
});

router.post("/add", function(req, res){
  const newMeal = new Meal({
    date: req.body.date,
    mealName: req.body.mealName,
    calories: req.body.calories
  });

  newMeal.save(function(err) {
    if (!err) {
      console.log("Successfully added meal.");
      res.redirect("/meals");
    } else {
      res.send(err);
    }
  })
});

//READ
router.get("/meals", function(req, res){
  if(req.isAuthenticated()){
    Meal.find(function(err, foundMeals) {
      if (foundMeals) {
        res.render('meals', {
          mealList: foundMeals
        })
      } else {
        res.send(err);
      }
    })
  }else{
    res.redirect("/login");
  }
});

//UPDATE
router.post("/update", function(req, res){
  console.log(req.body);
  res.redirect("/update" + "/" + req.body.button);
});

router.get("/update/:id", function(req, res){
  if(req.isAuthenticated()){
    const meal = {
      date: '',
      mealName: '',
    }
    Meal.findOne({
        _id: req.params.id
      },
      function(err, foundMeal) {
        if (!err) {
          res.render('update', {
            id: req.params.id,
            date: foundMeal.date,
            mealName: foundMeal.mealName,
            calories: foundMeal.calories
          })
        } else {
          res.send(err);
        }
      }
    )
  }else{
    res.redirect("/login");
  }
});

router.post("/update/:id", function(req, res){
  Meal.findByIdAndUpdate({
      _id: req.params.id
    }, {
      date: req.body.date,
      mealName: req.body.mealName,
      calories: req.body.calories
    },
    function(err) {
      if (!err) {
        res.redirect("/meals");
      } else {
        res.send(err);
      }
    }
  );
});

//DELETE
router.post("/delete", function(req, res){
  if(req.isAuthenticated()){
    Meal.findByIdAndDelete({_id: req.body.button}, function(err) {
      if (!err) {
        console.log("Successfully deleted article.");
        res.redirect("/meals")
      } else {
        res.send(err);
      }
    })
  }else{
    res.redirect("/login");
  }
});

module.exports = router;
