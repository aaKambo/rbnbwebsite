const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const Listing = require("../MODELS/LISTING.JS");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../MODELS/review.js");
const listingController = require("../controllers/listings.js")
// require and usage of `multer`
const multer  = require('multer')
// require storage file
const {storage} = require("../cloudConfig.js");
// require storage file
const upload = multer({storage});
// require and usage of `multer`


router
.route("/")
.get(WrapAsync(listingController.index))
.post( 
  isLoggedIn,
  // processing of add new image for new listing for cloud storage
  upload.single("listing[image]"),
  // processing of add new image for new listing for cloud storage
  validateListing,
  WrapAsync(listingController.CreateListing)
); 



// NEW ROUTE 
router.get("/new", isLoggedIn,listingController.renderNewForm);


router
.route("/:id")
.get(WrapAsync(listingController.ShowListing))
.put(
   isLoggedIn, 
   isOwner,
  //  processing of the image for the edit listing for cloud storage 
  upload.single("listing[image]"),
     //  processing of the image for the edit listing for cloud storage 
   validateListing, 
    WrapAsync(listingController.UpdateListing)
  )
  .delete(isLoggedIn, isOwner, WrapAsync(listingController.DestroyListing));


// Edit route
router.get(
    "/:id/edit",
  isLoggedIn,
  isOwner,
    WrapAsync(listingController.EditListing));


module.exports = router;
