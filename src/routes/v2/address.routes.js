import express from "express";

import {
    addAddress,
    getAddress,
    updateAddress,
} from "../../controller/v2/address.controller.js";
import { verifyJwtToken } from "../../middleware/jwt.js";
const router = express.Router();

router.post("/", verifyJwtToken, addAddress);
router.get("/", verifyJwtToken, getAddress);
router.put("/", verifyJwtToken, updateAddress);

export default router;
