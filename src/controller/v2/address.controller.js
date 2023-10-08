import mongoose from "mongoose";

import { UserAddress } from "../../models/address.model.js";

import {
    addressUpdateValidate,
    addressValidate,
} from "../../validations/address.js";
import createError from "http-errors";

export const addAddress = async (req, res, next) => {
    try {
        const { error } = addressValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const address = { _id: new mongoose.Types.ObjectId(), ...req.body };

        const newAddress = await UserAddress.findOneAndUpdate(
            { user: req.user.userId },
            {
                $push: { address },
            },
            { new: true, upsert: true }
        );

        return res.json({
            status: "success",
            elements: newAddress,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

export const updateAddress = async (req, res, next) => {
    try {
        const { error } = addressUpdateValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { _id, ...address } = req.body;

        if (!_id) {
            throw createError.BadRequest("Required parameters missing!");
        }

        const updatedAddress = await UserAddress.findOneAndUpdate(
            { user: req.user.userId, "address._id": _id },
            {
                $set: {
                    "address.$": address,
                },
            },
            {
                new: true,
            }
        );

        if (!updateAddress) throw createError.BadRequest();

        return res.status(201).json({ updatedAddress });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;

        next(error);
    }
};

export const getAddress = async (req, res, next) => {
    try {
        const userAddress = await UserAddress.findOne({
            user: req.user.userId,
        });
        if (userAddress) {
            return res.status(200).json({ userAddress });
        } else {
            return res.status(204).json({ userAddress: [] });
        }
    } catch (error) {
        next(error);
    }
};
