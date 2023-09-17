import Joi from "joi";

export const addressValidate = (data) => {
    const userSchema = Joi.object({
        name: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
        mobile: Joi
            .string()
            .regex(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.required": `"mobile" cannot be an empty field`,
                "string.pattern.base": `mobile number must have 10 digits.`,
            }),
        postalCode: Joi
            .string()
            .regex(/(?:0[1-9]|[13-8][0-9]|2[ab1-9]|9[0-5])(?:[0-9]{3})?|9[78][1-9](?:[0-9]{2})?/)
            .required()
            .messages({
                "string.required": `"postalCode" cannot be an empty field`,
                "string.pattern.base": `postalCode must match the pattern`,
            }),
        address: Joi.string().min(10).max(100).trim().required().messages({
            "string.required": `"address" cannot be an empty field`,
        }),
        city: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"city" cannot be an empty field`,
        }),
        department: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"department" cannot be an empty field`,
        }),
        addressType:Joi.string().valid(...['Home', 'Work']).required(),
    });

    return userSchema.validate(data);
};

export const addressUpdateValidate = (data) => {
    const userSchema = Joi.object({
        _id: Joi.string().hex().length(24).required().messages({
            "string.required": `"_id" cannot be an empty field`,
        }),
        name: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"name" cannot be an empty field`,
        }),
        mobile: Joi
            .string()
            .regex(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.required": `"mobile" cannot be an empty field`,
                "string.pattern.base": `mobile number must have 10 digits.`,
            }),
        postalCode: Joi
            .string()
            .regex(/(?:0[1-9]|[13-8][0-9]|2[ab1-9]|9[0-5])(?:[0-9]{3})?|9[78][1-9](?:[0-9]{2})?/)
            .required()
            .messages({
                "string.required": `"postalCode" cannot be an empty field`,
                "string.pattern.base": `postalCode must match the pattern`,
            }),
        address: Joi.string().min(10).max(100).trim().required().messages({
            "string.required": `"address" cannot be an empty field`,
        }),
        city: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"city" cannot be an empty field`,
        }),
        department: Joi.string().min(3).max(50).trim().required().messages({
            "string.required": `"department" cannot be an empty field`,
        }),
        addressType:Joi.string().valid(...['Home', 'Work']).required(),
    });

    return userSchema.validate(data);
};

