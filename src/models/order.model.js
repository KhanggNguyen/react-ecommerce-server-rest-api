import mongoose from "mongoose";
import { addressSchema } from "./address.model.js";
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: addressSchema,
        totalAmount: {
            type: Number,
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                payablePrice: {
                    type: Number,
                    required: true,
                },
                purchasedQty: {
                    type: Number,
                    required: true,
                },
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "cancelled", "refund"],
            required: true,
        },
        paymentType: {
            type: String,
            enum: ["cod", "card"],
            required: true,
        },
        paymentIntent: {
            type: String,
            required: true,
        },
        orderStatus: [
            {
                type: {
                    type: String,
                    enum: ["ordered", "packed", "shipped", "delivered"],
                    default: "ordered",
                },
                date: {
                    type: Date,
                },
                isCompleted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);
mongoose.model("Address", addressSchema);
export default mongoose.model("Order", orderSchema);
