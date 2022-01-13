const express = require("express");

const {
    requireSignin,
    adminMiddleware,
    uploadS3,
} = require("../middleware");

const {
    createProduct,
    getProductsByCategory,
    getProductDetailsById,
    deleteProductById,
    getProducts,
} = require("../controller/product");

const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.post(
    "/product/create",
    requireSignin,
    adminMiddleware,
    uploadS3.array("productPicture"),
    createProduct
);

router.get("/product/", getProducts);

router.get("/products/:categorySlug", getProductsByCategory);

router.get("/product/:productId", getProductDetailsById);

router.delete(
    "/product/deleteProductById",
    requireSignin,
    adminMiddleware,
    deleteProductById
);

module.exports = router;
