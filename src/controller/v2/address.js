const mongoose = require("mongoose");

const UserAddress = require("../models/address");

exports.addAddress = async (req, res) => {
    const address = req.body;
    if (!address)
        return res.status(400).json({ error: "Params address required" });

    if (address._id) {
        try {
            const updatedAddress = await UserAddress.findOneAndUpdate(
                { user: req.user._id, "address._id": address._id },
                {
                    $set: {
                        "address.$": address,
                    },
                },
                {
                    new: true,
                }
            );

            if (updatedAddress) {
                return res.status(201).json({ updatedAddress });
            }
        } catch (error) {
            return res.status(400).json({ error });
        }
    }

    address._id = mongoose.Types.ObjectId();

    try {
        const newAddress = await UserAddress.findOneAndUpdate(
            { user: req.user._id },
            {
                $push: {
                    address: address,
                },
            },
            { new: true, upsert: true }
        );

        if (newAdress) {
            res.status(201).json({ newAddress });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const userAddress = await UserAddress.findOne({ user: req.user._id });
        if (userAddress) {
            console.log(userAddress);
            return res.status(200).json({ userAddress });
        } else {
            return res.status(204).json({ userAddress: [] });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
};
