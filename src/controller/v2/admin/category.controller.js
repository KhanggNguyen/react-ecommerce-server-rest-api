import Category from "../../../models/category.model.js";
import slugify from "slugify";
import shortid from "shortid";
import createError from "http-errors";
import {
    categoryPutValidate,
    categoryValidate,
} from "../../../validations/category.js";

import { uploadImage } from "../../../utils/cloudinary.js";

export const addCategory = async (req, res, next) => {
    try {
        const { error } = categoryValidate(req.body);

        if (error) {
            throw createError(error);
        }

        // const updatedCategory = await Category.findOneAndUpdate(
        //     {
        //         name: req.body.name,
        //         slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        //     },
        //     { isActive: true },
        //     {
        //         upsert: true,
        //         new: true,
        //     }
        // );

        // if (!updatedCategory) {
            const categoryObj = {
                name: req.body.name,
                slug: `${slugify(req.body.name)}-${shortid.generate()}`,
                createdBy: req.user.userId,
            };

            if (req.file) {
                const newUrl = await uploadImage(req.file.path);
                categoryObj.categoryImage = newUrl;
            }

            if (req.body.parentId) {
                categoryObj.parentId = req.body.parentId;
            }

            const _category = new Category(categoryObj);

            const savedCategory = await _category.save();

            return res.json({
                status: "success",
                elements: savedCategory,
            });
        // }

        // return res.json({
        //     status: "success",
        //     elements: updatedCategory,
        // });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { _id, name, parentId } = req.body;

        const { error } = categoryPutValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const category = {
            name,
            slug: `${slugify(req.body.name)}-${shortid.generate()}`,
            updatedBy: req.user.userId,
        };

        if (req.file) {
            const newUrl = await uploadImage(req.file.path);
            category.categoryImage = newUrl;
        }

        if (parentId !== "") {
            category.parentId = parentId;
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id },
            category,
            {
                upsert: true,
                new: true,
            }
        );

        return res.json({ message: "success", updatedCategory });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res) => {
    const { _id } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            {
                _id,
            },
            { isActive: false },
            {
                upsert: true,
                new: true,
            }
        );

        if (updatedCategory) {
            return res.status(201).json({
                message: "Category desactivated",
                category: updatedCategory,
            });
        }
    } catch (error) {
        next(error);
    }
};
