const express = require('express');
const { requireSignin, adminMiddleware } = require("../../middleware");
const { updateOrder, getAllOrder } = require("../../controller/v1/admin/order");
const router = express.Router();

router.post("/admin/order/all", requireSignin, adminMiddleware, getAllOrder);
router.post("/admin/order/update", requireSignin, adminMiddleware, updateOrder);

module.exports = router;