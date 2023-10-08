import Stripe from "stripe";
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_KEY);

export const createStripeCustomer = async ({ name, email }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Customer = await stripe.customers.create({
                name: name,
                email: email,
            });

            resolve(Customer);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

export const attachMethod = async ({ paymentMethod, customerId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethodAttach = await stripe.paymentMethods.attach(
                paymentMethod.id,
                {
                    customer: customerId,
                }
            );
            resolve(paymentMethodAttach);
        } catch (err) {
            reject(err);
        }
    });
};

export const listCustomerPayMethods = async (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethods = await stripe.customers.listPaymentMethods(
                customerId,
                {
                    type: "card",
                }
            );
            resolve(paymentMethods);
        } catch (err) {
            reject(err);
        }
    });
};
