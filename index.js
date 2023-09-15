import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import env from "dotenv";
import config from "config";

import("./src/middleware/passportConfig.js");
import chalk from "chalk";
import router from "./src/routes/index.router.js";
import connectDB from "./src/utils/connectDB.js";

//get env variable
env.config();
const nodeEnv = process.env.NODE_ENV;

const app = express();

const PORT = config.get(`${nodeEnv}.PORT`) || 3000;

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    })
);

app.use(router);

app.use((req, res, next) => {
    next(createError.NotFound("This route does not exists."));
});

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});

app.listen(PORT, (error) => {
    try {
        connectDB();
        console.log(
            `${chalk.blue("Starting server on port ")} ${PORT} ${chalk.green(
                "✓"
            )}`
        );
    } catch (err) {
        console.error("Error while starting", err);
    }
});
