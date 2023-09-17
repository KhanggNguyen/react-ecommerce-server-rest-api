import User from "../../../models/user.model.js";
import bcrypt from "bcrypt";
import { userValidate } from "../../../validations/auth.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: "user" });

        return res.json({ users, message: "success" });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { _id } = req.body;

        const { error } = userValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const updatedUser = await User.findOneAndUpdate({ _id }, req.body, {
            new: true,
        });

        return res.json({ user: updatedUser, message: "success" });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error);
    }
};
