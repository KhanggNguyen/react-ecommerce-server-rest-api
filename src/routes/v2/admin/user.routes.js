import express from "express";
import {
    getUsers,
    updateUser,
} from "../../../controller/v2/admin/user.controller.js";
const router = express.Router();

import { verifyJwtToken, role } from "../../../middleware/jwt.js";

router.post("/admin/users", verifyJwtToken, role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN), getUsers);

router.put("/admin/user", verifyJwtToken, role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN), updateUser);

export default router;
