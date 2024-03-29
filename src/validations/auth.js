import Joi from "joi";
import { USER } from '../constants/index.js';
export const userValidate = (data) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(3).max(20).required().messages({
            "string.required": `"firstName" cannot be an empty field`,
        }),
        lastName: Joi.string().min(3).max(20).required().messages({
            "string.required": `"lastName" cannot be an empty field`,
        }),
        email: Joi.string().email().lowercase().required().messages({
            "string.required": `"email" cannot be an empty field`,
        }),
        password: Joi.string().min(8).max(40).required().messages({
            "string.required": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {8}`,
            "string.max": `"password" should have a maximum length of {40}`,
        }),
        passwordConfirm: Joi.string().min(8).max(40).required().messages({
            "string.required": `"passwordConfirm" cannot be an empty field`,
            "string.min": `"passwordConfirm" should have a minimum length of {8}`,
            "string.max": `"passwordConfirm" should have a maximum length of {40}`,
        }),
        dateOfBirth: Joi.date(),
        gender: Joi.string().valid(...USER.GENDER),
    });

    return userSchema.validate(data);
};

export const userUpdateValidate = (data) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(3).max(20).messages({
            "string.required": `"firstName" cannot be an empty field`,
        }),
        lastName: Joi.string().min(3).max(20).messages({
            "string.required": `"lastName" cannot be an empty field`,
        }),
        dateOfBirth: Joi.date(),
        gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    });

    return userSchema.validate(data);
};

export const adminUserUpdateValidate = (data) => {
    const userSchema = Joi.object({
        _id: Joi.string().hex().length(24).required().messages({
            "string.required": `"_id" cannot be an empty field`,
        }),
        firstName: Joi.string().min(3).max(20).messages({
            "string.required": `"firstName" cannot be an empty field`,
        }),
        lastName: Joi.string().min(3).max(20).messages({
            "string.required": `"lastName" cannot be an empty field`,
        }),
        dateOfBirth: Joi.date(),
        gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    });

    return userSchema.validate(data);
};

export const userPasswordValidate = (data) => {
    const userSchema = Joi.object({
        oldPassword: Joi.string().min(8).max(40).required().messages({
            "string.required": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {8}`,
            "string.max": `"password" should have a maximum length of {40}`,
        }),
        password: Joi.string().min(8).max(40).required().messages({
            "string.required": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {8}`,
            "string.max": `"password" should have a maximum length of {40}`,
        }),
        passwordConfirm: Joi.string().min(8).max(40).required().messages({
            "string.required": `"passwordConfirm" cannot be an empty field`,
            "string.min": `"passwordConfirm" should have a minimum length of {8}`,
            "string.max": `"passwordConfirm" should have a maximum length of {40}`,
        })
    });

    return userSchema.validate(data);
};

export const userLoginValidate = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().lowercase().required().messages({
            "string.empty": `"email" cannot be an empty field`,
        }),
        password: Joi.string().min(8).max(40).required().messages({
            "string.required": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {8}`,
            "string.max": `"password" should have a maximum length of {40}`,
        }),
    });

    return loginSchema.validate(data);
};