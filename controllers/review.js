const express = require("express");
router = express.Router({ mergeParams: true });
const reviews = require("../models/review.js");
const campground = require("../models/campground");

//********************************************************** */
module.exports.createReview = async (req, res) => {
  const id = await campground.findById(req.params.id);
  const review = new reviews(req.body.review);
  review.author = req.user._id;
  id.review.push(review);
  await review.save();
  await id.save();
  req.flash("success", "created new review");
  res.redirect("/campground/" + String(id._id));
};

module.exports.delete = async (req, res) => {
  const { id, reviewid } = req.params;
  await campground.findByIdAndUpdate(id, { $pull: { review: reviewid } });
  await reviews.findByIdAndDelete(reviewid);
  req.flash("success", "review is deleted");
  res.redirect("/campground/" + String(id));
};
