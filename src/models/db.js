const mongoose = require("mongoose");

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.i5mpx.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((err) => {
        try {
            console.log("Connected to MONGO DB");
        } catch (err) {
            console.log(`Error while connecting to MongoDB`);
            console.error(err);
        }
    });
