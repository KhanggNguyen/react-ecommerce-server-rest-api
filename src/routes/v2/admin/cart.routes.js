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
    "/cart/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    addItemToCart
);

router.put(
    "/cart/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    updateCartItems
);

router.get(
    "/cart/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    getCartItems
);

router.delete(
    "/cart/removeItem",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    removeCartItems
);

router.delete(
    "/cart/emptyCartItems",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    emptyCartItems
);

export default router;
