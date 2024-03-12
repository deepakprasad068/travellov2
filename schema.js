const joi = require("joi");

module.exports.campgroundSchema = (req, res, next) => {
  const campgroundschema = joi.object({
    campground: joi.object().required({
      title: joi.string().required,
      price: joi.number().max(5).min(1).required,
      //   Image: joi.string().required,
      location: joi.string().required,
      description: joi.string().required,
    }).required,
  });
};

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().max(5).min(1),
      body: joi.string().required(),
    })
    .required(),
});
