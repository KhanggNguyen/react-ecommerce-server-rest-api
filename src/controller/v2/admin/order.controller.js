import Order from "../../../models/order.model.js";

export const updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await Order.updateOne(
            { _id: req.body.orderId, "orderStatus.type": req.body.type },
            {
                $set: {
                    "orderStatus.$": [
                        {
                            type: req.body.type,
                            date: new Date(),
                            isCompleted: true,
                        },
                    ],
                },
            }
        );

        return res
            .status(200)
            .json({ order: updatedOrder, message: "success" });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("items.productId", "_id name productPictures")
            .populate("user", "lastName firstName");
        // const orders = await Order.aggregate([
        //     {
        //         $sort: { createdAt: -1 },
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "user",
        //             foreignField: "_id",
        //             as: "user",
        //         },
        //     },
        //     {
        //         $unwind: "$user",
        //     },
        //     {
        //         $group: {
        //             _id: "$user._id",
        //             orders: {
        //                 $push: "$$ROOT",
        //             },
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             user: "$user",
        //             orders: 1,
        //         },
        //     },
        // ]);
        return res.status(200).json({ message: "success", orders });
    } catch (error) {
        next(error);
    }
};
