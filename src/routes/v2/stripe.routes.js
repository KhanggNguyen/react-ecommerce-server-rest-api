import {
    confirmPayment,
    createPayment,
    paymentMethodAttach,
    paymentMethods,
    stripeWebhook,
} from "../../controller/v2/stripe.controller.js";
import { verifyJwtToken } from "../../middleware/jwt.js";

import express from "express";
const router = express.Router();

router.post("/attach", verifyJwtToken, paymentMethodAttach);
router.post(
    "/webhook",
    express.json({ type: "application/json" }),
    stripeWebhook
);

router.get("/methods", verifyJwtToken, paymentMethods);

router.post("/create", verifyJwtToken, createPayment);

router.post("/confirm", verifyJwtToken, confirmPayment);

export default router;
