const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(STRIPE_KEY);

exports.orderPayment = (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "eur",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) return res.status(500).json({ stripeErr });
            else return res.status(200).json(stripeRes);
        }
    );
};
