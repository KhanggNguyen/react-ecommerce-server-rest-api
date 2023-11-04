import  mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        categoryImage: { type: String },
        parentId: {
            type: String,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
