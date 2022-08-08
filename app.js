require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const homeRoute = require("./routes/homeRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");
const userAuthRoute = require("./routes/userAuthRoute");
const crudRoute = require("./routes/crudRoute");

const User = require("./models/User");
const Meal = require("./models/Meal");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    done(err, user);
  })
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/meals",
    useProfileURL:"https://www.googleapis.com/oauth20/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



//List of APIs
app.use("/", homeRoute);
app.use("/auth/google", googleAuthRoute);
app.use("/", userAuthRoute);
app.use("/", crudRoute);


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000
}

app.listen(port, function(req, res) {
  console.log("Server is running on port 3000.");
})
