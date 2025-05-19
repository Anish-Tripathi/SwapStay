const Stripe = require('stripe');
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Stripe secret key is missing from environment variables');
  throw new Error('Stripe secret key is not configured');
}

const stripe = new Stripe(stripeSecretKey);
console.log('Stripe initialized successfully');

module.exports = { stripe };
