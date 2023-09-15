const express = require("express");
const {
    addItemToCart,
    getCartItems,
    removeCartItems,
    emptyCartItems,
} = require("../controller/v1/cart");

const { requireSignin, userMiddleware } = require("../middleware");

const router = express.Router();

router.post(
    "/user/cart/addtocart",
    requireSignin,
    userMiddleware,
    addItemToCart
);

router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);

//new update
router.post(
    "/user/cart/removeItem",
    requireSignin,
    userMiddleware,
    removeCartItems
);

router.post("/user/cart/emptyCartItems", requireSignin, userMiddleware, emptyCartItems);

module.exports = router;
