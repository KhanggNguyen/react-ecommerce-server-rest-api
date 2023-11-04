import express from "express";
const router = express.Router();

import { upload } from "../../../utils/multerConfig.js";

import {
    addCategory,
    deleteCategory,
    updateCategory
} from "../../../controller/v2/admin/category.controller.js";

import { role, verifyJwtToken } from "../../../middleware/jwt.js";

router.post(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    upload.single("categoryImage"),
    addCategory
);

router.put(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    upload.single("categoryImage"),
    updateCategory
);

router.delete(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    deleteCategory
);

export default router;
