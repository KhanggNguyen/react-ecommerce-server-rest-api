const { orderPayment } = require("../controller/stripe");
const { userMiddleware, requireSignin } = require("../middleware");

const router = require("express").Router();

router.post("/payment", requireSignin, userMiddleware, orderPayment);

module.exports = router;