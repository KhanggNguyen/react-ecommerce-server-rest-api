import passport from "passport";
import jwt from "jsonwebtoken";
import config from "config";
import createError from "http-errors";
const auth = passport.authenticate("jwt", { session: false });
import client from "../utils/connectRedis.js";

import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV;

export const signAccessToken = async (userId, role) => {
    return new Promise((resolve, reject) => {
        const payload = { userId, role };
        const secret = config.get(`${nodeEnv}.JWT_ACCESSTOKEN_SECRET`);
        const options = {
            expiresIn: config.get(`${nodeEnv}.JWT_ACCESSTOKEN_EXP`),
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};

export const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const secret = config.get(`${nodeEnv}.JWT_REFRESHTOKEN_SECRET`);

        const options = {
            expiresIn: config.get(`${nodeEnv}.JWT_REFRESHTOKEN_EXP`),
        };

        jwt.sign(payload, secret, options, async (err, token) => {
            if (err) reject(err);

            await client.set(
                userId.toString(),
                token,
                { EX: 24 * 60 * 60 * 1000 },
                (err, reply) => {
                    if (err) {
                        return reject(createError.InternalServerError());
                    }
                }
            );

            resolve(token);
        });
    });
};

export const verifyJwtToken = async (req, res, next) => {
    try {
        // if (!req.headers["authorization"]) {
        //     return next(createError(400, "Authorization missing."));
        // }

        // const authHeader = req.headers["authorization"];
        // const accessToken = authHeader.split(" ")[1];

        const accessToken = req.cookies["accessToken"];

        jwt.verify(
            accessToken,
            config.get(`${nodeEnv}.JWT_ACCESSTOKEN_SECRET`),
            (err, payload) => {
                if (err) {
                    if (err.name === "JsonWebTokenError") {
                        return next(createError.Unauthorized());
                    }
                    return next(createError(400, "Token is not valid."));
                }

                req.user = payload;
                next();
            }
        );
    } catch (err) {
        next(err);
    }
};

export const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            config.get(`${nodeEnv}.JWT_REFRESHTOKEN_SECRET`),
            async (err, payload) => {
                if (err) return reject(err);

                const tokenFound = await client.get(
                    payload.userId,
                    (err, reply) => {
                        if (err) {
                            return reject(createError.InternalServerError());
                        }
                        return reply;
                    }
                );

                if (tokenFound === refreshToken) {
                    return resolve(payload);
                }

                return reject(createError.Unauthorized());
            }
        );
    });
};

export const ROLES = {
    Admin: "admin",
    Member: "member",
    Manager: "manager",
};

export const checkRole =
    (...roles) =>
    (req, res, next) => {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const hasRole = roles.find((role) => req.user.role === role);
        if (!hasRole) {
            return res
                .status(403)
                .send("You are not allowed to make this request.");
        }

        return next();
    };

export const role = { ROLES, checkRole };
