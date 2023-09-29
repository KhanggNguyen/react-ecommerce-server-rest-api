import Product from "../../../models/product.model.js";
import Category from "../../../models/category.model.js";
import slugify from "slugify";
import createError from "http-errors";

import {
    productPutValidate,
    productStatusPutValidate,
    productValidate,
} from "../../../validations/product.js";
import { uploadImage } from "../../../utils/cloudinary.js";

export const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, quantity } = req.body;

        const { error } = productValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const categoryObj =
            category &&
            (await Category.findOne({ _id: category }).select(
                "_id name children slug"
            ));

        if (!categoryObj) {
            throw createError.BadRequest("Category Not Found!");
        }

        let productPictures = [];
        let productPicturesUrls = [];

        if (req.files.length > 0) {
            productPictures = req.files.map((file) => {
                return { url: file.path };
            });
        }
        for (const picture of productPictures) {
            const newUrl = await uploadImage(picture.url);
            productPicturesUrls.push({ img: newUrl });
        }

        const _product = new Product({
            name: name,
            slug: slugify(name),
            price,
            quantity,
            description,
            productPictures: productPicturesUrls,
            category,
            createdBy: req.user.userId,
        });

        const savedProduct = await _product.save();

        return res.json({
            status: "success",
            elements: savedProduct,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { _id, name, price, description, category, quantity } = req.body;

        const { error } = productPutValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const categoryObj =
            category &&
            (await Category.findOne({ _id: category }).select(
                "_id name children slug"
            ));

        if (!categoryObj) {
            throw createError.BadRequest("Category Not Found!");
        }

        let productPictures = [];
        let productPicturesUrls = [];

        if (req.files.length > 0) {
            productPictures = req.files.map((file) => {
                return { img: file.location };
            });
        }

        for (const picture of productPictures) {
            const newUrl = await uploadImage(picture.url);
            productPicturesUrls.push({ img: newUrl });
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

        const updatedProduct = await Product.findOneAndUpdate(
            { _id },
            product,
            {
                upsert: true,
                new: true,
            }
        );

        return res.status(201).json({ updatedProduct });
    } catch (error) {
        next(error);
    }
};

export const updateStatusProduct = async (req, res, next) => {
    try {
        const { _id, status } = req.body;

        const { error } = productStatusPutValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id },
            { status },
            {
                upsert: true,
                new: true,
            }
        );

        return res.status(201).json({ updatedProduct });
    } catch (error) {
        next(error);
    }
};
