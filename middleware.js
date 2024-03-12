const campground = require("./models/campground");
const { expressError } = require("./utils/expressError");
const { campgroundSchema, reviewSchema } = require("./schema");
const review = require("./models/review");

//********************************************************************************* */
//checking that user is login or not
module.exports.islogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.orginalUrl;
    req.flash("error", "you must signed in");
    return res.redirect("/login");
  }
  next();
};

//validation checking that input are in given domain
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new expressError(message, 404);
  } else {
    next();
  }
};
//checking that is user own that campground or not
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect("/campground/" + id);
  }
  next();
};
//checking that review is validate or not
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.bod);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new expressError(message, 404);
  } else {
    next();
  }
};

//checking that user own that review or not
module.exports.reviewauthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const reviews = await review.findById(reviewid);
  if (!reviews.author.equals(req.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect("/campground/" + id);
  }
  next();
};
