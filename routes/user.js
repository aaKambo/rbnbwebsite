const express = require("express");
const router = express.Router();
const User = require("../MODELS/user.js"); 
const WrapAsync = require("../Utils/WrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const UserController = require("../controllers/users.js")


// New In Code ✅
router.route("/signup")
.get( UserController.RenderSignupForm)
.post(WrapAsync(UserController.SignUp))

router.route("/login")
.get(  UserController.RenderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    UserController.Login
);

// New In Code ✅ 
router.get("/logout", UserController.LogOut)


module.exports = router;

    


