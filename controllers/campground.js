const express = require("express");

const campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOXTOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const cloudinary = require("../cloudinary/indix");
//***************************************************************** */
module.exports.index = async (req, res, next) => {
  const comp = await campground.find({});
  res.render("campground/index", { comp });
};

module.exports.newReq = (req, res) => {
  res.render("campground/new");
};

module.exports.creating = async (req, res) => {
  // if (!res.body.campground)
  //   throw new expressError("invalid campground data", 404);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const ncamp = new campground(req.body.campground);
  ncamp.geometry = geoData.body.features[0].geometry;
  ncamp.Image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  ncamp.author = req.user._id;
  await ncamp.save();
  const a = ncamp._id;
  console.log(ncamp);
  req.flash("success", "successfully created new campground");
  res.redirect("campground/" + a);
};

module.exports.updatePost = async (req, res) => {
  const camp = await campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.Image.push(...imgs);
  await camp.save();
  if (req.body.deleteImage) {
    for (let filename of req.body.deleteImage) {
      await cloudinary.cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { Image: { filename: { $in: req.body.deleteImage } } },
    });
  }
  req.flash("success", "successuly updated campground");
  res.redirect("/campground/" + req.params.id);
};

module.exports.updateReq = async (req, res) => {
  const id = req.params.id;
  const camp = await campground.findById(id);

  if (!camp) {
    req.flash("error", "campground not found");
    return res.redirect("/campground");
  }
  res.render("campground/edit", { camp });
};

module.exports.showing = async (req, res) => {
  const camp = await campground
    .findById(req.params.id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("author");
  if (!camp) {
    req.flash("error", "campground not found");
    return res.redirect("/campground");
  }
  res.render("campground/show", { camp });
};

module.exports.deleting = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "campground is deleted");
  res.redirect("/campground");
};
