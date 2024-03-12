const express = require("express");
router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

const { validatereview, islogin, reviewauthor } = require("../middleware.js");

const rev = require("../controllers/review.js");
//*********************************************************************** */

router.post("/", validatereview, islogin, catchAsync(rev.createReview));

router.delete("/:reviewid", islogin, reviewauthor, catchAsync(rev.delete));

module.exports = router;
