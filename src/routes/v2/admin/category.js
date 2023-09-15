const express = require("express");
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../../controller/v2/category");
const {
    requireSignin,
    adminMiddleware,
    superAdminMiddleware,
} = require("../../middleware");

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
    "/admin/category/create",
    requireSignin,
    adminMiddleware,
    upload.single("categoryImage"),
    addCategory
);

router.post(
    "/admin/category/update",
    requireSignin,
    adminMiddleware,
    upload.array("categoryImage"),
    updateCategory
);

router.post(
    "/admin/category/delete",
    requireSignin,
    adminMiddleware,
    deleteCategory
);

module.exports = router;
