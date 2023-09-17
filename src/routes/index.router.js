import express from "express";
const router = new express.Router();

//routes
import authRoutes from "./v2/auth.routes.js";
import userRoutes from "./v2/user.routes.js";
import adminAuthRoutes from "./v2/admin/auth.routes.js";
import adminUserRoutes from "./v2/admin/user.routes.js";
// import adminOrderRoutes from "./v1/admin/order"
// import productRoutes from "./v1/product"
// import categoryRoutes from "./v1/category"
// import cartRoutes from "./v1/cart"
// import addressRoutes from "./v1/address"
// import orderRoutes from "./v1/order"
// import stripeRoutes from "./v1/stripe"

// router.use("/public", express.static(path.join(__dirname, "uploads")));
// router.use("/api", productRoutes);
// router.use("/api", categoryRoutes);
router.use("/api", authRoutes);
router.use("/api", adminAuthRoutes);
router.use("/api", adminUserRoutes);
router.use("/api", userRoutes);
// router.use("/api", adminOrderRoutes);
// router.use("/api", cartRoutes);
// router.use("/api", addressRoutes);
// router.use("/api", orderRoutes);
// router.use("/api", stripeRoutes);

export default router;
