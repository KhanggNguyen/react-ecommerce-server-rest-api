import express from "express";
import {
    signup,
    signin,
    signout,
    refreshToken,
} from "../../controller/v2/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh-token", refreshToken);
router.post("/signout", signout);

// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

export default router;
