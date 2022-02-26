const { requireSignin, userMiddleware } = require("../middleware");
const { addOrder, getOrders, getOrder } = require("../controller/order");
const router = require("express").Router();

router.post("/order/create", requireSignin, userMiddleware, addOrder);
router.get("/orders/", requireSignin, userMiddleware, getOrders);
router.post("/order/", requireSignin, userMiddleware, getOrder);

module.exports = router;
