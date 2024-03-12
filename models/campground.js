const mongoose = require("mongoose");
const reviewSchema = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opti = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    Image: [imageSchema],
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opti
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  const url = "/campground/" + this._id;
  return (
    "<a href=" +
    url +
    ">" +
    this.title +
    "</a><p>" +
    this.description.substring(0, 30) +
    "...</p>"
  );
});

campgroundSchema.post("findOneAndDelete", async function (deletedCampground) {
  if (deletedCampground) {
    try {
      const reviewsToDelete = deletedCampground.review;
      await reviewSchema.deleteMany({ _id: { $in: reviewsToDelete } });
      // console.log("Associated reviews deleted successfully.");
    } catch (error) {
      console.error("Error deleting associated reviews:", error);
      // Optionally, handle the error further as needed.
    }
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
