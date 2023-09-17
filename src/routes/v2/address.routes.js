import express from "express";

import {
    addAddress,
    getAddress,
    updateAddress,
} from "../../controller/v2/address.controller.js";
import { verifyJwtToken } from "../../middleware/jwt.js";
const router = express.Router();

router.post("/address/", verifyJwtToken, addAddress);
router.get("/address/", verifyJwtToken, getAddress);
router.put("/address/", verifyJwtToken, updateAddress);

export default router;
