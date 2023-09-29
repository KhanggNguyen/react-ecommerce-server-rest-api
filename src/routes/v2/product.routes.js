import express from "express";

import {
    getProducts,
} from "../../controller/v2/product.controller.js";

const router = express.Router();

router.get("/product/", getProducts);

export default router;
