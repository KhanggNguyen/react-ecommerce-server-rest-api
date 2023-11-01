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

export const createPaymentMethod = async (
    paymentMethod,
    customerId,
    amount,
    currency = "EUR"
) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log({
                amount: amount * 100,
                currency: currency ?? "EUR",
                customer: customerId,
                payment_method: paymentMethod,
                confirmation_method: "manual", // For 3D Security
                description: "Buy Product",
            });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: currency ?? "EUR",
                customer: customerId,
                payment_method: paymentMethod,
                confirmation_method: "manual", // For 3D Security
                description: "Buy Product",
            });

            resolve(paymentIntent);
        } catch (err) {
            reject(err);
        }
    });
};

export const confirmPaymentIntent = async (paymentIntent, paymentMethod) => {
    return new Promise( async (resolve,reject) => {
        try{
            const intent = await stripe.paymentIntents.confirm(paymentIntent, {
                payment_method: paymentMethod,
            });
            
            resolve(intent);
        }catch(error){
            reject(error);
        }
    })
}