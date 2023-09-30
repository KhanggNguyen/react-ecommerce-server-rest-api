import express from "express";

import { getCategories } from "../../controller/v2/category.controller.js";

const router = express.Router();

router.get("/category/", getCategories);

export default router;
