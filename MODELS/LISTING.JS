
const { ref, string } = require("joi");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");; // Use require instead of import

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [8, 'Title must be at least 8 characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long']
    },
    image: {
        // for the cloud storage 
        url: String,
        filename: String,
         // for the cloud storage 
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    // Assuming the listing can have multiple reviews
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review' // Reference the Review model
     },
    ],
 // new for setting list owner
 owner:{
    type: Schema.Types.ObjectId,
    ref:"User" ,
},
// below code is for storing map data i will work on it later
// geometry:{
// type: {
//     type: String, // Don't do `{ location: { type: String } }`
//     enum: ['Point'], // 'location.type' must be 'Point'
//     required: true
//   },
//   coordinates: {
//     type: [Number],
//     required: true
//   },
// }

});

// when post is deleted post related reviews are deleted through this code 3 line of code 
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;



