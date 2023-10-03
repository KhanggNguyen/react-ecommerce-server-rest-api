import express from "express";

const router = express.Router();

import { getUser, updatePassword, updateUser } from "../../controller/v2/user.controller.js";

import { verifyJwtToken } from "../../middleware/jwt.js";

router.post("/", verifyJwtToken, getUser);
router.put("/", verifyJwtToken, updateUser);
router.put("/password", verifyJwtToken, updatePassword);


export default router;
