import User from "../../models/user.model.js";
import { userValidate } from "../../validations/auth.js";

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
        const { error } = userValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.userId },
            req.body,
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
