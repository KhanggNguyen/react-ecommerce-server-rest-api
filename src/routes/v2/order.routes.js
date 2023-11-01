import express from "express";
import { verifyJwtToken } from "../../middleware/jwt.js";
import {
    addOrder,
    getOrders,
    getOrder,
} from "../../controller/v2/order.controller.js";
const router = express.Router();

router.post("/", verifyJwtToken, addOrder);
router.get("/", verifyJwtToken, getOrders);
router.get("/:orderId", verifyJwtToken, getOrder);

export default router;
