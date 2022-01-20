const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
    //res.status(200).json( { file: req.files, body: req.body } );

    const { name, price, description, category, quantity, createdBy } =
        req.body;

    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.location };
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id,
    });

    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product, files: req.files });
        }
    });
};

exports.updateProduct = async (req, res) => {
    const { _id, name, price, description, category, quantity } =
        req.body;

    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.location };
        });
    }

    const product = {
        _id,
        name,
        price,
        description,
        category,
        quantity,
        productPictures,
    };

    const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
        new: true,
    });

    return res.status(201).json({ updatedProduct });
};

exports.getProductsByCategory = (req, res) => {
    const { categoryId } = req.params;

    Category.findOne({ _id: categoryId })
        .select("_id name children slug")
        .exec((error, category) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (category) {
                Product.find({ category: category._id })
                    .populate({ path: "category", select: "_id name" })
                    .exec((error, products) => {
                        if (error) {
                            return res.status(400).json({ error });
                        }

                        res.status(200).json({ products });
                    });
            } else res.status(400).json({ message: "Category not found" });
        });
};

exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId }).exec((error, product) => {
            if (error) return res.status(400).json({ error });
            if (product) {
                res.status(200).json({ product });
            }
        });
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};

// new update
exports.deleteProductById = (req, res) => {
    const { _id } = req.body.payload;
    
    if (_id) {
        Product.deleteOne({ _id }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        });
    } else {
        res.status(400).json({ error: "Params required" });
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find()
        .select(
            "_id name price quantity slug description productPictures category"
        )
        .populate({ path: "category", select: "_id name" })
        .exec();

    res.status(200).json({ products });
};
