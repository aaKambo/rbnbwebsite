const   listings= require("./MODELS/LISTING.JS");
const Review = require("./MODELS/review.js");
const { listingSchema,reviewSchema } = require("./Schema.js");
const ExpressError = require("./Utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl =(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}; 


module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the list ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else {
        next();
    }
};


module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else {
        next();
    }
};

//  new in a code 
module.exports.isReviewAuthor= async(req, res, next)=>{
    let {id, reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
// UPPER MAIN HUM NA REVIEW KO REQUIRE KIA HAI  new in a code 