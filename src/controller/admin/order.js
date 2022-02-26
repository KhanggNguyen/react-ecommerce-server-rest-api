const Order = require("../../models/order");

const { asyncHandler } = require("../../middleware/asyncHandler");

exports.updateOrder = asyncHandler( (req, res, next) => {
    console.log(req.body);
    console.log(`Request to /api/admin/order/update`);

    Order.updateOne(
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
    ).exec((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
            res.status(201).json({ order });
        }
    });
});

exports.getAllOrder = (req, res) => {
    console.log(`Request to /api/admin/order/all`);
    Order.find()
        .sort({ createdAt: "desc" })
        .select("_id paymentStatus paymentType orderStatus items createdAt")
        .populate("items.productId", "_id name productPictures")
        .populate("user", "_id firstName lastName")
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) {
                res.status(200).json({ orders });
            }
        });
};