import User from "../../../models/user.model.js";

import {
    userPasswordValidate,
    adminUserUpdateValidate,
} from "../../../validations/auth.js";

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
        const { error } = adminUserUpdateValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { _id, email, password, passwordConfirm, ...user } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: _id ?? req.user.userId },
            user,
            {
                new: true,
            }
        );

        return res.json({ user: updatedUser, message: "success" });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error);
    }
};
