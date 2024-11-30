// requiring "dotenv" pakg and applying a condition for `development phase`
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET) // remove this after you've confirmed it is working
// requiring "dotenv" pakg and print the output of the `.env` file in the vs terminal


const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
// const Listing = require("./MODELS/LISTING.JS");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const WrapAsync = require("./Utils/WrapeAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./Schema.js");
// const Review = require("./MODELS/review.js"); // Change to require
const session = require("express-session");
const MongoStore = require('connect-mongo');
const listingRouter = require("./routes/listing.js"); // Corrected the variable name to match the import
const reviewsRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js") 
const flash = require("connect-flash")
const passport = require("passport")
// below must be change 
const LocalStrategy = require("passport-local")
// below must be change 
const User = require("./MODELS/user.js");
const { console } = require('inspector');
// const userRouter = require("./routes/user.js")

// getting atlas mongo db url from env file
const dburl = process.env.ATLASDB_URL;

async function main() {
    // use the atlas db url
    await mongoose.connect(dburl);
}

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

    // CREATES A MONGO STORE FOR STORING SESSION INFO
const store =MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret: process.env.SECRET,

    },
    touchAfter:24 * 3600,

})

store.on("error",()=>{
    console.log("error in mongo session store",err )
})

    const sessionOption = {
        store, //pass store related info
        secret: process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge:  7 * 24 * 60 * 60 * 1000,
            httponly: true
        }
      };

app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser =req.user; 
next();
})  

// //  below code must be change  
// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student", 
//     });
//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
// }); 

// Use the listings router
app.use("/listings", listingRouter); // Corrected route registration
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
// 404 Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// General Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("app listening on port 8080");
});
