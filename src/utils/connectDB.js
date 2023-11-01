import mongoose from "mongoose";
import chalk from "chalk";

async function connectDB() {
    try {
        const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.i5mpx.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(
            `${chalk.blue("Database connected successfully")} ${chalk.green(
                "✓"
            )}`
        );
    } catch (err) {
        console.log(` ${chalk.red("X")} ${chalk.red(err)}`);
        process.exit(1);
    }
}
export default connectDB;
