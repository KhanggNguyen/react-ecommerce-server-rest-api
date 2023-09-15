const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const { asyncHandler } = require("../middleware/asyncHandler");
exports.addOrder = (req, res) => {
    console.log(`Request to /api/order/create`);
    Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            req.body.user = req.user._id;
            req.body.orderStatus = [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted: true,
                },
                {
                    type: "packed",
                    isCompleted: false,
                },
                {
                    type: "shipped",
                    isCompleted: false,
                },
                {
                    type: "delivered",
                    isCompleted: false,
                },
            ];
            const order = new Order(req.body);
            order.save((error, order) => {
                if (error) return res.status(400).json({ error });
                if (order) {
                    //Order success
                    res.status(201).json({ order });
                }
            });
        }
    });
};

exports.getOrders = (req, res) => {
    console.log(`Request to /api/orders/`);
    Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("items.productId", "_id name productPictures")
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) {
                res.status(200).json({ orders });
            }
        });
};

exports.getOrder = (req, res) => {
    console.log(`Request to /api/order/`);
    Order.findOne({ _id: req.body.orderId })
        .populate("items.productId", "_id name productPictures")
        .lean()
        .exec((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
                Address.findOne({
                    user: req.user._id,
                }).exec((error, address) => {
                    if (error) return res.status(400).json({ error });
                    order.address = address.address.find(
                        (adr) =>
                            adr._id.toString() == order.addressId.toString()
                    );
                    res.status(200).json({
                        order,
                    });
                });
            }
        });
};

exports.getCustomerOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .populate("user")
        .exec();
    res.status(200).json({ orders });
};