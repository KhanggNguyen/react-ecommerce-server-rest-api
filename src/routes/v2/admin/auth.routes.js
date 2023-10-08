import express from "express";
import {
    signup,
    signin,
    signout,
    refreshToken
} from "../../../controller/v2/admin/auth.controller.js";
import { verifyJwtToken, verifyRefreshToken } from "../../../middleware/jwt.js";
import { isUserLoggedin } from "../../../controller/v2/auth.controller.js";

const router = express.Router();

router.post("/signup",  signup);
router.post("/signin",  signin);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/signout", verifyRefreshToken, signout);
router.post("/isUserLoggedIn", verifyJwtToken, verifyRefreshToken, isUserLoggedin)

export default router;
