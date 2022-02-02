const { check, validationResult } = require("express-validator");

exports.validateCreateProductRequest = [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("price", "price is required").notEmpty().isNumeric(),
    check("category", "Category is required").notEmpty(),
    check("quantity", "Quantity is required").notEmpty().isNumeric(),
]

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};
