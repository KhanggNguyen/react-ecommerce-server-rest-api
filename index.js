const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//get env variable
env.config();

//routes
const authRoutes = require("./src/routes/auth");
const adminAuthRoutes = require("./src/routes/admin/auth");
const adminUserRoutes = require("./src/routes/admin/user");
const adminOrderRoutes = require("./src/routes/admin/order");
const productRoutes = require("./src/routes/product");
const categoryRoutes = require("./src/routes/category");
const cartRoutes = require("./src/routes/cart");
const addressRoutes = require("./src/routes/address");
const orderRoutes = require("./src/routes/order");
const stripeRoutes = require("./src/routes/stripe");

//MONGO DB CONNEXION
require("./src/models/db");

//middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", authRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api", adminUserRoutes);
app.use("/api", adminOrderRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
