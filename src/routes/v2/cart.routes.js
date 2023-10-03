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

router.post("/", verifyJwtToken, addItemToCart);

router.put("/", verifyJwtToken, updateCartItems);

router.get("/", verifyJwtToken, getCartItems);

router.delete("/removeItem", verifyJwtToken, removeCartItems);

router.delete("/emptyCartItems", verifyJwtToken, emptyCartItems);

export default router;
