import multer from "multer";
import path from "path";
import shortid from "shortid";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});

const imageFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(null, false);

        return cb(new Error("Only .png, .jpg, .jpeg, .webp format are allowed!"));
    }
};

export const upload = multer({ storage, fileFilter: imageFilter });
