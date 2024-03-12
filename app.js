if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// importing express
const express = require("express");
const app = express();
//importing ejs mate for layout
const ejsmate = require("ejs-mate");

const catchAsync = require("./utils/catchAsync");
const expressError = require("./utils/expressError");

const joi = require("joi");

const session = require("express-session");

const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local");

//importing path which is inbuild in node.js
const path = require("path");
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//parshing post request
app.use(express.urlencoded({ extended: true }));
//importing mongoose
const mongoose = require("mongoose");
//importing campground schema
const campground = require("./models/campground");
const user = require("./models/user.js");
//importing method-override for using post request as put and delete
const methodOverride = require("method-override");
//connecting with mongoose db and checking if it is connected
const url='mongodb+srv://deepakprasad068:9064227916@yelp-camp.ocg4d6v.mongodb.net/?retryWrites=true&w=majority&appName=yelp-camp'
mongoose
  .connect(url, {}) //mongodb://localhost:27017/yelp-camp
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
app.use(methodOverride("_method"));

const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

const sessionConfig = {
  secret: "there should be better secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httponly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxage: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

const campgroute = require("./routes/campground.js");
const reviewroute = require("./routes/review.js");
const userroute = require("./routes/user.js");

const users = require("./models/user.js");

app.use(express.static(path.join(__dirname, "public")));
// this route is use for declaring some globle data which can be used from any page

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.use("/", userroute);
app.use("/campground", campgroute);
app.use("/campground/:id/review", reviewroute);

app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});
app.use((err, req, res, next) => {
  const { statesCode = 500 } = err;
  if (!err.message) err.message = "oh some thing went wrong";
  res.render("error", { err });
});
//listening to port 3000..
app.listen(3000, () => {
  console.log("listening to port 3000..");
});
