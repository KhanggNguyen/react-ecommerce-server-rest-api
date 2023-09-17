import express from "express";

const router = express.Router();

import { getUser, updateUser } from "../../controller/v2/user.controller.js";

import { verifyJwtToken } from "../../middleware/jwt.js";

router.post("/user/", verifyJwtToken, getUser);
router.put("/user/", verifyJwtToken, updateUser);

export default router;
