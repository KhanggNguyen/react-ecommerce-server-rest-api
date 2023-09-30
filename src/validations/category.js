import Joi from "joi";

export const categoryValidate = (data) => {
    const categorySchema = Joi.object({
        name: Joi.string().trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
        parentId: Joi.string().hex().length(24),
    });

    return categorySchema.validate(data);
};

export const categoryPutValidate = (data) => {
    const categorySchema = Joi.object({
        _id: Joi.string().hex().length(24).required().messages({
            "string.required": `"_id" cannot be an empty field`,
        }),
        name: Joi.string().trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
    });

    return categorySchema.validate(data);
};
