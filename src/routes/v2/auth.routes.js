import express from "express";
import {
    signup,
    signin,
    signout,
    refreshToken,
    isUserLoggedin,
} from "../../controller/v2/auth.controller.js";
import { verifyJwtToken, verifyRefreshToken } from "../../middleware/jwt.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/signout", verifyRefreshToken, signout);
router.post("/isUserLoggedIn", verifyJwtToken, isUserLoggedin)

// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

export default router;
