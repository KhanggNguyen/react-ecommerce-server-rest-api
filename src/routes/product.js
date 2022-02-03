const express = require("express");

const { requireSignin, adminMiddleware, uploadS3 } = require("../middleware");

const {
    createProduct,
    updateProduct,
    getProductsByCategory,
    getProductDetailsById,
    deleteProductById,
    getProducts,
} = require("../controller/product");

const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const { validateCreateProductRequest, isRequestValidated } = require("../middleware/productValidator");

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
    isRequestValidated,
    uploadS3.array("productPicture"),
    createProduct
);

router.post(
    "/product/update",
    requireSignin,
    adminMiddleware,
    isRequestValidated,
    uploadS3.array("productPicture"),
    updateProduct
);

router.get("/product/", getProducts);

router.get("/products/:categoryName", getProductsByCategory);

router.get("/product/:productId", getProductDetailsById);

router.post(
    "/product/deleteProductById",
    requireSignin,
    adminMiddleware,
    deleteProductById
);

module.exports = router;
