import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    postalCode: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        required: true,
        enum: ["Home", "Work"],
        required: true,
    },
});

const userAddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        address: [addressSchema],
    },
    { timestamps: true }
);

mongoose.model("Address", addressSchema);
const UserAddress = mongoose.model("UserAddress", userAddressSchema);

export {
    UserAddress, 
    addressSchema
}
