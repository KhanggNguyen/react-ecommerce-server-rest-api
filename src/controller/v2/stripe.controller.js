import User from "../../models/user.model.js";
import createError from "http-errors";
import { attachMethod, listCustomerPayMethods } from "../../utils/stripe.js";

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
    const { paymentMethod, amount, currency } = req.body;

    const user = await User.find({ _id: req.user.userId });

    if (!user) throw createError.BadRequest();

    const customerId = user.stripeId;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency ?? "EUR",
            customer: customerId,
            payment_method: paymentMethod,
            confirmation_method: "manual", // For 3D Security
            description: "Buy Product",
        });

        /* Add the payment intent record to your datbase if required */
        return res.json(paymentIntent);
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req, res, next) => {
    const { paymentIntent, paymentMethod } = req.body;
    try {
        const intent = await stripe.paymentIntents.confirm(paymentIntent, {
            payment_method: paymentMethod,
        });

        /* Update the status of the payment to indicate confirmation */
        return res.status(200).json({ message: "success", intent });
    } catch (err) {
        error.message = "Could not confirm payment";
        next(error);
    }
};
