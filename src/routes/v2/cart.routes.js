import express from "express";
import {
    addItemToCart,
    getCartItems,
    removeCartItems,
    emptyCartItems,
    updateCartItems,
} from "../../controller/v2/cart.controller.js";

import { verifyJwtToken } from "../../middleware/jwt.js";

const router = express.Router();

router.post("/cart/", verifyJwtToken, addItemToCart);

router.put("/cart/", verifyJwtToken, updateCartItems);

router.get("/cart/", verifyJwtToken, getCartItems);

router.delete("/cart/removeItem", verifyJwtToken, removeCartItems);

router.delete("/cart/emptyCartItems", verifyJwtToken, emptyCartItems);

export default router;
