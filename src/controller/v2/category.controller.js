import Category from "../../models/category.model.js";

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id),
        });
    }

    return categoryList;
}

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        
        const categoriesOrdered = createCategories(categories);

        return res.json({
            message: "success",
            categories: categoriesOrdered,
        });
    } catch (error) {
        next(error);
    }
};
