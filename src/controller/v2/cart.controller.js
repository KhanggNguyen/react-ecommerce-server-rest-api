import createError from "http-errors";
import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import { cartPutValidate, cartValidate } from "../../validations/cart.js";
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
        const { error } = cartValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user.userId });

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
                    user: req.user.userId,
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
                condition = { user: req.user.userId };
                update = {
                    $push: {
                        cartItems: { product: product._id, quantity },
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
                user: req.user.userId,
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
        const cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) throw createError.BadRequest();

        //if cart already exists then update cart by quantity
        const { error } = cartPutValidate(req.body);

        if (error) {
            throw createError(error);
        }

        const product = await Product.findOne({ _id: req.body.productId });

        if (!product) throw createError.NotFound("Product is not registered.");

        const cartiItem = cart.cartItems.find(
            (c) => c.product == product._id.toString()
        );

        if (!cartiItem) throw createError.BadRequest();

        let isPull = cartiItem.quantity <= 1 && req.body.flag === -1;

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
                user: req.user.userId,
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
        const cart = await Cart.findOne({ user: req.user.userId }).populate(
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
                console.log(cartItems)
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
        const { productId } = req.body;

        if (!productId) return;

        const updatedCart = await Cart.findOneAndUpdate(
            { user: req.user.userId },
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
        const cart = await Cart.deleteOne({ user: req.user.userId });

        return res.status(202).json({ message: "success", cart });
    } catch (error) {
        next(error);
    }
};
