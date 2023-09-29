import jwt from "jsonwebtoken";
// import multer from "multer";
// import shortid from "shortid";
// import path from "path";
// import multerS3 from "multer-s3";
// import aws from "aws-sdk";

export const requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    } else {
        return res.status(400).json({ message: "Authorization required" });
    }

    next();
};

export const userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(400).json({ message: "User access denied" });
    }

    next();
};

export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        if (req.user.role !== "super-admin") {
            return res.status(400).json({ message: "Admin access denied" });
        }
    }

    next();
};

export const superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== "super-admin") {
        return res.status(200).json({ message: "Super Admin access denied" });
    }
    
    next();
};


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(__dirname), "uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + "-" + file.originalname);
//     },
// });

// const accessKeyId = process.env.ACCESS_KEY_ID;
// const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// const s3 = new aws.S3({
//     accessKeyId,
//     secretAccessKey,
// });

// export const upload = multer({ storage });

// export const uploadS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: "myawsecommerce",
//         acl: "public-read",
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, shortid.generate() + "-" + file.originalname);
//         },
//     }),
// });