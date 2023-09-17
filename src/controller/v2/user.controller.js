import createError from "http-errors";
import User from "../../models/user.model.js";
import { userPasswordValidate, userUpdateValidate } from "../../validations/auth.js";

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });

        if (!user) {
            throw createError.NotFound("User is not registered.");
        }

        return res.json({ user, message: "success" });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { error } = userUpdateValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { email, password, passwordConfirm, ...user } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.userId },
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

export const updatePassword = async (req, res, next) => {
    try {
        const { error } = userPasswordValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { oldPassword, password, passwordConfirm } = req.body;

        const user = await User.findOne({ _id: req.user.userId }).select("+password");

        const { isMatch } = await user.authenticate(oldPassword);

        if (!isMatch || user.disabled) {
            throw createError.Unauthorized();
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.userId },
            { password, passwordConfirm },
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
