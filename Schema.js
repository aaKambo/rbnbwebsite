const joi = require('joi');
const review = require('./MODELS/review.js');


module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(), // You can add a max length if needed
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("", null),  // Lowercase 'image' to match Mongoose schema
        
    }).required(),
});
 

// review schema with joi for server side validation:
module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
});