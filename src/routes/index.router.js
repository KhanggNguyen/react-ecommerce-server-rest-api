import express from "express";
const router = new express.Router();

//routes
import authRoutes from "./v2/auth.routes.js";
import userRoutes from "./v2/user.routes.js";
import adminAuthRoutes from "./v2/admin/auth.routes.js";
import adminUserRoutes from "./v2/admin/user.routes.js";
import adminProductRoutes from "./v2/admin/product.routes.js";
import adminCategoryRoutes from "./v2/admin/category.routes.js";
import adminCartRoutes from "./v2/admin/cart.routes.js";
import adminOrderRoutes from "./v2/admin/order.routes.js";
import productRoutes from "./v2/product.routes.js";
import categoryRoutes from "./v2/category.routes.js";
import cartRoutes from "./v2/cart.routes.js";
import addressRoutes from "./v2/address.routes.js";
import orderRoutes from "./v2/order.routes.js";
import stripeRoutes from "./v2/stripe.routes.js";

// router.use("/public", express.static(path.join(__dirname, "uploads")));

/**
 * ADMIN
 */
router.use("/api/admin", adminAuthRoutes);
router.use("/api/admin/category", adminCategoryRoutes);
router.use("/api/admin/product", adminProductRoutes);
router.use("/api/admin/user", adminUserRoutes);
router.use("/api/admin/cart", adminCartRoutes);
router.use("/api/admin/order", adminOrderRoutes);

/**
 * USER
 */
router.use("/api", authRoutes);
router.use("/api/category", categoryRoutes);
router.use("/api/product", productRoutes);
router.use("/api/user", userRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/address", addressRoutes);
router.use("/api/order", orderRoutes);
router.use("/api/payment", stripeRoutes);

export default router;
