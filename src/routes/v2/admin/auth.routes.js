import express from "express";
import {
    signup,
    signin,
    signout,
    refreshToken
} from "../../../controller/v2/admin/auth.controller.js";

const router = express.Router();

router.post("/admin/signup",  signup);
router.post("/admin/signin",  signin);
router.post("/admin/refresh-token", refreshToken);
router.post("/admin/signout", signout);

export default router;
