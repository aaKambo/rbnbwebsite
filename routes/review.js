
const express = require("express");
const router = express.Router({mergeParams:true});
const WrapAsync = require("../Utils/WrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Review = require("../MODELS/review.js"); // Change to require
const Listing = require("../MODELS/LISTING.JS");
const {validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
// New In Code ✅
const ReviewControllers = require("../controllers/reveiw.js")

// Reviews route 
router.post(
    "/",
    isLoggedIn,
     validatereview,
    WrapAsync(ReviewControllers.ListingReview));

// DELETE REVIEWS
router.delete(
    "/:reviewid", 
    // new in a code 
    isLoggedIn,
    isReviewAuthor, 
    //  isReviewAuthor o hum na upper ma require kia hai new in a code 
    WrapAsync(ReviewControllers.DestroyReview));


module.exports = router;

// New In Code ✅