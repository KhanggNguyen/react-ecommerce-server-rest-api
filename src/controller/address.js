const mongoose = require("mongoose");

const address = require("../models/address");
const UserAddress = require("../models/address");

exports.addAddress = (req, res) => {
    //return res.status(200).json({body: req.body})
    console.log(`Request add address by ${req.user._id}`);
    const address = req.body;
    if (!address)
        return res.status(400).json({ error: "Params address required" });

    if (address._id) {
        UserAddress.findOneAndUpdate(
            { user: req.user._id, "address._id": address._id },
            {
                $set: {
                    "address.$": address,
                },
            },
            {
                new: true,
            }
        ).exec((error, address) => {
            if (error) return res.status(400).json({ error });
            console.log(address);
            if (address) {
                return res.status(201).json({ address });
            }
        });
    }

    address._id = mongoose.Types.ObjectId();

    UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                address: address,
            },
        },
        { new: true, upsert: true }
    ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        console.log(`New address added : ${address}`);
        if (address) {
            res.status(201).json({ address });
        }
    });
};

exports.getAddress = (req, res) => {
    console.log(`Request get address by ${req.user._id}`);

    UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
        if (error) return res.status(400).json({ error });
        if (userAddress) {
            console.log(userAddress);
            return res.status(200).json({ userAddress });
        } else {
            return res.status(204).json({ userAddress: [] });
        }
    });
};
