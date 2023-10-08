import shortid from "shortid";
import createError from "http-errors";

import User from "../../models/user.model.js";
import { userLoginValidate, userValidate } from "../../validations/auth.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../middleware/jwt.js";

import client from "../../utils/connectRedis.js";
import { createStripeCustomer } from "../../utils/stripe.js";

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, passwordConfirm } =
            req.body;

        const isExist = await User.findOne({ email });

        if (isExist) {
            throw createError.Conflict(`${email} has been registered !`);
        }

        const { error } = userValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const userName = [lastName, firstName].join(" ");
        const customer = await createStripeCustomer({ userName, email });

        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            passwordConfirm,
            userName: shortid.generate(),
            stripeId: customer.id,
        });

        const savedUser = await _user.save();

        return res.json({
            status: "success",
            elements: savedUser,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { error } = userLoginValidate(req.body);
        if (error) {
            throw createError(error);
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw createError.NotFound("User is not registered.");
        }

        const { isMatch } = await user.authenticate(password);

        if (!isMatch || user.disabled) {
            throw createError.Unauthorized();
        }

        user.password = undefined;

        const accessToken = await signAccessToken(user._id, user.role);
        const refreshToken = await signRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ user, message: "success" });

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: true,
        //     maxAge: 60 * 60 * 1000,
        // });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        // });

        //return res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw createError.NotFound("User is not registered.");
        }

        const accessToken = await signAccessToken(userId, user.role);
        //const newRefreshToken = await signRefreshToken(userId);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000,
        });

        // res.cookie("refreshToken", newRefreshToken, {
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: false,
        //     maxAge: 24 * 60 * 60 * 1000,
        // });

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: true,
        //     maxAge: 60 * 60 * 1000,
        // });

        // res.cookie("refreshToken", newRefreshToken, {
        //     httpOnly: true,
        //     sameSite: "None",
        //     secure: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        // });

        //return res.json({ accessToken, refreshToken: newRefreshToken });
        return res.json({ user, message: "success" });
    } catch (err) {
        next(err);
    }
};

export const signout = async (req, res, next) => {
    try {
        const { userId } = req.user;

        await client.del(userId.toString(), (err, reply) => {
            if (err) {
                throw createError.InternalServerError();
            }
        });

        res.cookie("accessToken", "none", {
            maxAge: 0,
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.cookie("refreshToken", "", {
            maxAge: 0,
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });

        return res.json({
            status: "success",
            message: "User logged out successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const isUserLoggedin = (req, res, next) => {
    return res.status(200).json({ message: "success" });
};
