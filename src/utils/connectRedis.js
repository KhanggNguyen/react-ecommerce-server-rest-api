import { createClient } from "redis";
import chalk from "chalk";

const redisClient = createClient({
    port: process.env.PORT,
    host: process.env.REDIS_URI,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error(error.message);
        setInterval(5000, connectRedis);
    }
};

connectRedis();

redisClient.on("connect", () =>
    console.log(`${chalk.blue("Redis client connected successfully")} ${chalk.green("✓")}`)
);

redisClient.on("error", (err) => console.error(err));

export default redisClient;
