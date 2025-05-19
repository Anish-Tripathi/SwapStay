const express = require('express');
const router = express.Router();
const { stripe } = require('../utils/initStripe');

router.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ 
      error: 'Stripe payment service is currently unavailable',
      details: 'Stripe was not properly initialized'
    });
  }

  const { amount, currency = 'inr', description = 'SwapStay Booking' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      error: 'Invalid payment amount', 
      message: 'Amount must be a positive number' 
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount ),
      currency: currency.toLowerCase(),
      description,
      payment_method_types: ['card']
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed', 
      details: error.message
    });
  }
});

module.exports = router;
