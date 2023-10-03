import Joi from "joi";

export const cartValidate = (data) => {
    const cartSchema = Joi.object({
        productId: Joi.string().hex().length(24).required().messages({
            "string.required": `"productId" cannot be an empty field`,
        }),
        quantity: Joi.number().min(1),
    });

    return cartSchema.validate(data);
};

export const cartPutValidate = (data) => {
    const cartSchema = Joi.object({
        productId: Joi.string().hex().length(24).required().messages({
            "string.required": `"productId" cannot be an empty field`,
        }),
        flag: Joi.number().valid(-1, 1).required().messages({
            "number.required": `"flag" cannot be an empty field`,
        }),
    });

    return cartSchema.validate(data);
};
