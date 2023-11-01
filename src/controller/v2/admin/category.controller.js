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

// export const deleteCategory = async (req, res) => {
//     console.log(`Request to /api/admin/category/delete`);
//     const { _id } = req.body.payload;

//     const deleteCategory = await Category.findOneAndDelete({
//         _id,
//     });

//     if (deleteCategory) {
//         res.status(201).json({ message: "Category removed" });
//     } else {
//         res.status(400).json({ message: "Something went wrong" });
//     }
// };