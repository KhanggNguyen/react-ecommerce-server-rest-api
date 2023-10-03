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
// import adminOrderRoutes from "./v1/admin/order"
import productRoutes from "./v2/product.routes.js";
import categoryRoutes from "./v2/category.routes.js";
import cartRoutes from "./v2/cart.routes.js";
import addressRoutes from "./v2/address.routes.js";
// import orderRoutes from "./v1/order"
// import stripeRoutes from "./v1/stripe"

// router.use("/public", express.static(path.join(__dirname, "uploads")));

/**
 * ADMIN
 */
router.use("/api/admin", adminAuthRoutes);
router.use("/api/admin", adminUserRoutes);
router.use("/api/admin", adminProductRoutes);
router.use("/api/admin", adminCategoryRoutes);
router.use("/api/admin", adminCartRoutes);

/**
 * USER
 */
router.use("/api", productRoutes);
router.use("/api", categoryRoutes);
router.use("/api", authRoutes);
router.use("/api", userRoutes);
// router.use("/api", adminOrderRoutes);
router.use("/api", cartRoutes);
router.use("/api", addressRoutes);
// router.use("/api", orderRoutes);
// router.use("/api", stripeRoutes);

export default router;
