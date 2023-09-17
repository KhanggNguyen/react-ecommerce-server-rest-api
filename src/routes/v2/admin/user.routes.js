import express from "express";
import {
    getUsers,
    updateUser,
} from "../../../controller/v2/admin/user.controller.js";
const router = express.Router();

import { requireSignin, adminMiddleware } from "../../../middleware/index.js";

router.post("/admin/users", requireSignin, adminMiddleware, getUsers);

router.post("/admin/user/update", requireSignin, adminMiddleware, updateUser);

export default router;
