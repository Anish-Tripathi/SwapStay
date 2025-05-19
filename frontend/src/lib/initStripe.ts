import { loadStripe } from "@stripe/stripe-js";

export const initStripe = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  console.log(
    "Initializing Stripe:",
    publishableKey ? "Key found" : "Key missing"
  );

  if (!publishableKey) {
    console.error(
      "VITE_STRIPE_PUBLISHABLE_KEY is missing. Please check:\n" +
        "- .env file has it defined\n" +
        "- Restart your dev server"
    );
    return Promise.resolve(null);
  }

  return loadStripe(publishableKey)
    .then((stripe) => {
      if (!stripe) {
        console.error("Stripe initialized but returned null");
      } else {
        console.log("Stripe initialized successfully");
      }
      return stripe;
    })
    .catch((error) => {
      console.error("Stripe init failed:", error);
      return null;
    });
};

const stripePromise = initStripe();
export default stripePromise;
