import createError from "http-errors";
import Cart from "../../../models/cart.model.js";
import Product from "../../../models/product.model.js";
import {
    adminCartPutValidate,
    adminCartValidate,
} from "../../../validations/cart.js";

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });
}

export const addItemToCart = async (req, res, next) => {
    try {
        //if cart already exists then update cart by quantity
        const { error } = adminCartValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: userId });

        const product = await Product.findOne({ _id: productId });

        if (!product) throw createError.NotFound("Product is not registered.");

        if (cart) {
            const item = cart.cartItems.find(
                (c) => c.product == product._id.toString()
            );

            let condition, update;

            // increase cart
            if (item) {
                condition = {
                    user: userId,
                    "cartItems.product": product._id,
                };
                if (quantity) {
                    update = {
                        $inc: {
                            "cartItems.$.quantity": quantity,
                        },
                    };
                } else {
                    update = {
                        $inc: {
                            "cartItems.$.quantity": 1,
                        },
                    };
                }
            } else {
                //add to cart
                condition = { user: userId };
                update = {
                    $push: {
                        cartItems: { product: product._id },
                    },
                };
            }

            const updatedCart = await Cart.findOneAndUpdate(condition, update, {
                new: true,
                upsert: true,
            });

            return res
                .status(200)
                .json({ message: "success", cart: updatedCart });
        } else {
            //if cart not exist then create a new cart
            const cart = new Cart({
                user: userId,
                cartItems: {
                    product: product._id,
                    quantity: quantity ?? 1,
                },
            });
            const newCart = await cart.save();
            return res.status(201).json({ message: "success", cart: newCart });
        }
    } catch (error) {
        next(error);
    }
};

export const updateCartItems = async (req, res, next) => {
    try {
        //if cart already exists then update cart by quantity
        const { error } = adminCartPutValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { userId, productId, flag } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) throw createError.BadRequest();

        const product = await Product.findOne({ _id: productId });

        if (!product) throw createError.NotFound("Product is not registered.");

        const cartiItem = cart.cartItems.find(
            (c) => c.product == product._id.toString()
        );

        if (!cartiItem) throw createError.BadRequest();

        let isPull = cartiItem.quantity <= 1 && flag === -1;

        let update;
        if (isPull) {
            update = {
                $pull: {
                    cartItems: {
                        product: product._id,
                    },
                },
            };
        } else {
            update = {
                $inc: {
                    "cartItems.$.quantity": req.body.flag,
                },
            };
        }

        const updatedCart = await Cart.findOneAndUpdate(
            {
                user: userId,
                "cartItems.product": product._id,
            },
            update,
            {
                new: true,
                upsert: true,
            }
        );

        return res.status(200).json({ message: "success", cart: updatedCart });
    } catch (error) {
        next(error);
    }
};

export const getCartItems = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.body.userId }).populate(
            "cartItems.product",
            "_id name price productPictures"
        );
        let cartItems = {};
        if (cart) {
            cart.cartItems
                .filter((item) => item.quantity > 0)
                .forEach((item) => {
                    cartItems[item.product._id] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        img: item.product.productPictures[0]?.img,
                        price: item.product.price,
                        qty: item.quantity,
                    };
                });
        }
        return res.status(200).json({ message: "success", cartItems });
    } catch (error) {
        next(error);
    }
    //}
};

// new update remove cart items
export const removeCartItems = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;

        if (!productId || !userId)
            throw createError.BadRequest("Some parameters were missing!");

        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    cartItems: {
                        product: productId,
                    },
                },
            },
            {
                new: true,
                upsert: true,
            }
        );

        return res.status(202).json({ message: "success", updatedCart });
    } catch (error) {
        next(error);
    }
};

export const emptyCartItems = async (req, res, next) => {
    try {
        if (!req.body.userId)
            throw createError.BadRequest("Some parameters were missing!");

        const cart = await Cart.deleteOne({ user: req.body.userId });

        return res.status(202).json({ message: "success", cart });
    } catch (error) {
        next(error);
    }
};
