const { requireSignin, adminMiddleware, userMiddleware } = require("../middleware");
const { addOrder, getOrders, getOrder, updateOrder, getAllOrder } = require("../controller/order");
const router = require("express").Router();

router.post("/order/all", requireSignin, adminMiddleware, getAllOrder);
router.post("/order/create", requireSignin, userMiddleware, addOrder);
router.put("/order/update", requireSignin, adminMiddleware, updateOrder);
router.get("/orders/", requireSignin, userMiddleware, getOrders);
router.post("/order/", requireSignin, userMiddleware, getOrder);

module.exports = router;