// New In Code ✅

const Review = require("../MODELS/review.js"); // Change to require
const Listing = require("../MODELS/LISTING.JS");


module.exports.ListingReview = async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      // below is a new line
      let  newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      console.log(newReview);
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
  
      res.redirect(`/listings/${listing._id}`);
  };


  module.exports.DestroyReview = async (req, res) => {
      let { id, reviewid } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
      await Review.findByIdAndDelete(reviewid);
      req.flash("success", "Review Deleted")
      res.redirect(`/listings/${id}`);
  };

  // New In Code ✅