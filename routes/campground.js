const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { islogin, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campground");

const { storage } = require("../cloudinary/indix");
const multer = require("multer");
const upload = multer({ storage });

//*************************************************************************************************** */

router
  .route("")
  //showing all campground
  .get(catchAsync(campgrounds.index))
  //accepting post request for creating new camp ground
  .post(
    islogin,
    //  validateCampground,
    upload.array("Image"),
    catchAsync(campgrounds.creating)
  );
// .post(upload.array("Image"), (req, res) => {
//   console.log(req.files);
//   res.send(req.files);
// });
//creating new campground form
router.get("/new", islogin, campgrounds.newReq);
router
  .route("/:id")
  //accepting post request for updating campground
  .put(
    islogin,
    isAuthor,
    upload.array("Image"),
    // validateCampground, //VALIDATION IS NOT POSSIBLE BECAUSE VALIDATE CAMPGROUND IN SCHEMA NEED TO BE UPDATE WITH REVIEW ID
    catchAsync(campgrounds.updatePost)
  )
  //route for showing campground
  .get(islogin, catchAsync(campgrounds.showing))
  //accepting post request for deleting campground
  .delete(islogin, isAuthor, catchAsync(campgrounds.deleting));

//route for editing campground
router.get("/:id/edit", islogin, isAuthor, catchAsync(campgrounds.updateReq));

module.exports = router;
