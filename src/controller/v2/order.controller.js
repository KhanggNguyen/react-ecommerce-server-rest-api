import createError from "http-errors";
import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import { UserAddress } from "../../models/address.model.js";

export const addOrder = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { addressId, totalAmount, paymentStatus, items, paymentType } =
            req.body;

        const userAddress = await UserAddress.findOne({ user: userId });

        const address = userAddress.address.find( (ua) => ua._id.toString() === addressId);

        if (!address) throw createError.NotFound("Address not found");

        const orderStatus = [
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
        const _order = new Order({
            user: userId,
            orderStatus,
            address,
            totalAmount,
            paymentStatus,
            items,
            paymentType,
        });
        const order = await _order.save();

        const cart = await Cart.deleteOne({ user: req.user.userId });
        
        return res.status(201).json({ message: "success", order });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .populate("items.productId", "_id name productPictures");

        return res.status(200).json({ message: "success", orders });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId })
            .populate("items.productId", "_id name productPictures")
            .lean();

        if (!order) {
            throw createError.NotFound("Order not found");
        }

        return res.status(200).json({
            message: "success",
            order,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomerOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .populate("user")
        .exec();
    res.status(200).json({ orders });
};
