import express from "express";

import { upload } from "../../../utils/multerConfig.js";

import {
    createProduct,
    updateProduct,
    updateStatusProduct,
} from "../../../controller/v2/admin/product.controller.js";

import { role, verifyJwtToken } from "../../../middleware/jwt.js";

const router = express.Router();

router.post(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    upload.array("productPicture"),
    createProduct
);

router.put(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    upload.array("productPicture"),
    updateProduct
);

router.put(
    "/status",
    verifyJwtToken,
    role.checkRole(role.ROLES.SUPER_ADMIN),
    updateStatusProduct
);

export default router;
