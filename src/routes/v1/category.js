const express = require("express");
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controller/v1/category");
const {
    requireSignin,
    adminMiddleware,
    superAdminMiddleware,
} = require("../middleware");

const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

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
    "/category/create",
    requireSignin,
    adminMiddleware,
    upload.single("categoryImage"),
    addCategory
);

router.get("/category/", getCategories);

router.post(
    "/category/update",
    requireSignin,
    adminMiddleware,
    upload.array("categoryImage"),
    updateCategory
);

router.post(
    "/category/delete",
    requireSignin,
    adminMiddleware,
    deleteCategory
);

module.exports = router;
