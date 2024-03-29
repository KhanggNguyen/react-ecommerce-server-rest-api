const express = require("express");
const { signup, signin, signout } = require("../controller/v1/auth");
const {
    validateSignupRequest,
    isRequestValidated,
    validateSigninRequest,
} = require("../middleware/authValidator");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);

// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router;
