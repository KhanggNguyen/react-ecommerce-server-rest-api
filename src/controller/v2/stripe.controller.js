import User from "../../models/user.model.js";
import Cart from "../../models/cart.model.js";
import Order from "../../models/order.model.js";
import { UserAddress } from "../../models/address.model.js";
import createError from "http-errors";
import {
    attachMethod,
    createPaymentMethod,
    listCustomerPayMethods,
    confirmPaymentIntent,
} from "../../utils/stripe.js";

export const paymentMethodAttach = async (req, res, next) => {
    const { paymentMethod } = req.body;

    const user = await User.findOne({ _id: req.user.userId });

    if (!user) throw createError.BadRequest();

    const customerId = user.stripeId;

    try {
        const method = await attachMethod({ paymentMethod, customerId });
        return res
            .status(200)
            .json({ message: "Payment method attached succesully" });
    } catch (error) {
        console.error(error);
        error.status = 400;
        error.message = "Could not attach method";
        next(error);
    }
};

export const stripeWebhook = async (req, res, next) => {
    let data;
    let event;

    // Check if webhook signing is configured.
    let webhookSecret;

    const sig = req.headers["stripe-signature"];

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("⚠️  Webhook signature verification failed ", error);
        error.status = 400;
        error.message = `Webhook Error: ${err.message}`;
        next(error);
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            // Fulfill the order
            break;
        case "payment_intent.payment_failed":
            const paymentFailedIntent = event.data.object;
            // Notify the customer that their payment has failed
            break;
        // Handle other event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).end();
};

export const paymentMethods = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) throw createError.BadRequest();

    const customerId = user.stripeId;
    try {
        const paymentMethods = await listCustomerPayMethods(customerId);
        res.status(200).json(paymentMethods);
    } catch (err) {
        console.log(err);
        res.status(500).json("Could not get payment methods");
    }
};

export const createPayment = async (req, res, next) => {
    const { paymentMethod, selectedAddress } = req.body;

    const user = await User.findOne({ _id: req.user.userId });

    const cart = await Cart.findOne({ user: req.user.userId }).populate(
        "cartItems.product",
        "_id name price productPictures"
    );

    const userAddresses = await UserAddress.findOne({
        user: req.user.userId,
    });

    const address =
        userAddresses.address.length > 0 &&
        userAddresses.address.find(
            (adr) => adr._id.toString() == selectedAddress._id
        );

    console.log(address);

    if (!user || !cart || !address || (cart && cart.cartItems.length === 0))
        throw createError.BadRequest();

    const items = cart.cartItems.map((item) => ({
        productId: item.product._id,
        purchasedQty: item.quantity,
        payablePrice: item.product.price,
    }));

    const totalPrice = items.reduce((total, _item) => {
        return total + _item.payablePrice * _item.purchasedQty;
    }, 0);

    const customerId = user.stripeId;

    try {
        const paymentIntent = await createPaymentMethod(
            paymentMethod,
            customerId,
            totalPrice
        );

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
            user: user._id,
            orderStatus,
            address: address,
            totalAmount: totalPrice,
            paymentStatus: "pending",
            items,
            paymentIntent: paymentIntent.id,
            paymentType: "card",
        });

        await _order.save();

        await Cart.deleteOne({ user: req.user.userId });

        /* Add the payment intent record to your datbase if required */
        return res.json({ message: "success", paymentIntent });
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req, res, next) => {
    const { paymentIntent, paymentMethod } = req.body;
    try {
        const intent = await confirmPaymentIntent(paymentIntent, paymentMethod);

        await Order.findOneAndUpdate(
            { paymentIntent },
            { paymentStatus: "completed" }
        );

        /* Update the status of the payment to indicate confirmation */
        return res.status(200).json({ message: "success", paymentIntent: intent });
    } catch (error) {
        // error.message = "Could not confirm payment";
        next(error);
    }
};
