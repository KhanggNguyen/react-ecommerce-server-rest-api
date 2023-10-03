import express from "express";
import {
    signup,
    signin,
    signout,
    refreshToken
} from "../../../controller/v2/admin/auth.controller.js";

const router = express.Router();

router.post("/signup",  signup);
router.post("/signin",  signin);
router.post("/refresh-token", refreshToken);
router.post("/signout", signout);

export default router;
