import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import {PRODUCT} from "../../constants/index.js";

export const getProducts = async (req, res, next) => {
    let { categoryId, productId, limit, offset } = req.query;

    limit = limit || PRODUCT.DEFAULT_LIMIT;

    offset = offset || PRODUCT.DEFAULT_OFFSET;

    try {
        const category =
            categoryId &&
            (await Category.findOne({ _id: categoryId }).select(
                "_id name children slug"
            ));

        let products = [];
        if (category) {
            products = await Product.find({ category: category._id }).populate({
                path: "category",
                select: "_id name",
            });
        }

        if (productId) {
            products = await Product.findOne({ _id: productId });
        }

        if (!categoryId && !productId) {
            products = await Product.find()
                .skip(offset)
                .limit(limit)
                .select(
                    "_id name price quantity slug description productPictures category"
                )
                .populate({ path: "category", select: "_id name" });
        }

        if (!products) return res.status(204).json("No products was found.");

        return res.status(200).json({ products, message: "success" });
    } catch (error) {
        next(error);
    }
};
