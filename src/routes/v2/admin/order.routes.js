import express from "express";
const router = express.Router();
import { role, verifyJwtToken } from "../../../middleware/jwt.js";
import {
    getOrders,
    updateOrder,
} from "../../../controller/v2/admin/order.controller.js";

router.get(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    getOrders
);
router.put(
    "/",
    verifyJwtToken,
    role.checkRole(role.ROLES.ADMIN, role.ROLES.SUPER_ADMIN),
    updateOrder
);

export default router;
