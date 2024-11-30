
const Listing = require("../MODELS/LISTING.JS");

 module.exports.index = async (req, res, next) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.ShowListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
     path : "reviews",
   populate:{
    path:"author",
   },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing }); // Updated this render path
};

module.exports.CreateListing = async (req, res, next) => {
//    gets the url and filename from `req.file` for the processing cloud storage
    let url = req.file.path;
    let filename = req.file.filename;
// gets the url and filename from `req.file` for the processing cloud storage
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
//  save the newimage in the process of cloud storage
newListing.image = {url, filename};
//  save the newimage in the process of cloud storage
await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.EditListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
    }
    // preview edit list image
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250/bo_5px_solid_lightblue");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};
    // preview edit list image

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // applying condition on "req.file" and gets the "url" & "filename" from request body for image uploading for cloud storage 
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename}; // we are assign `url,filename` to listing.image 
    await listing.save();
}    
    // applying condition on "req.file" and gets the "url" & "filename" from request body for image uploading for cloud storage 
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.DestroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");
};
