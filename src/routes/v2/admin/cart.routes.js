import express from "express";
import {
    addItemToCart,
    getCartItems,
    removeCartItems,
    emptyCartItems,
    updateCartItems,
} from "../../../controller/v2/admin/cart.controller.js";

import { verifyJwtToken, role } from "../../../middleware/jwt.js";

const router = express.Router();

router.post(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    addItemToCart
);

router.put(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    updateCartItems
);

router.get(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    getCartItems
);

router.delete(
    "/removeItem",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    removeCartItems
);

router.delete(
    "/emptyCartItems",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    emptyCartItems
);

export default router;
