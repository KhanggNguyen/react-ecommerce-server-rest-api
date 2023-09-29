import Joi from "joi";
import {PRODUCT} from "../constants/index.js";

export const productValidate = (data) => {
    const productSchema = Joi.object({
        name: Joi.string().trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
        price: Joi.number().required().messages({
            "string.required": `"price" cannot be an empty field`,
        }),
        quantity: Joi.number().required().messages({
            "string.required": `"quantity" cannot be an empty field`,
        }),
        description: Joi.string().trim().required().messages({
            "string.required": `"description" cannot be an empty field`,
        }),
        category: Joi.string().hex().length(24).required().messages({
            "string.required": `"category" cannot be an empty field`,
        }),
    });

    return productSchema.validate(data);
};

export const productPutValidate = (data) => {
    const productSchema = Joi.object({
        _id: Joi.string().hex().length(24).required().messages({
            "string.required": `"_id" cannot be an empty field`,
        }),
        name: Joi.string().trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
        price: Joi.number().required().messages({
            "string.required": `"price" cannot be an empty field`,
        }),
        quantity: Joi.number().required().messages({
            "string.required": `"quantity" cannot be an empty field`,
        }),
        description: Joi.string().trim().required().messages({
            "string.required": `"description" cannot be an empty field`,
        }),
        category: Joi.string().hex().length(24).required().messages({
            "string.required": `"category" cannot be an empty field`,
        }),
    });

    return productSchema.validate(data);
};

export const productStatusPutValidate = (data) => {
    const productSchema = Joi.object({
        _id: Joi.string().hex().length(24).required().messages({
            "string.required": `"_id" cannot be an empty field`,
        }),
        gender: Joi.string().valid(...PRODUCT.STATUS)
    });

    return productSchema.validate(data);
}
