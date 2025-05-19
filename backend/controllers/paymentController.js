const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', bookingId } = req.body;
    
    // Validate inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }
    

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/paisa
      currency,
      metadata: { bookingId: bookingId || 'pending' },
      payment_method_types: ['card'],
      description: `Booking payment for ${bookingId || 'new booking'}`
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Payment processing failed',
      details: error.message
    });
  }
};

// Handle payment confirmation
const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId, amount } = req.body;
    
    // 1. Verify the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges.data.balance_transaction']
    });
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // 2. Safely access charge details
    const charge = paymentIntent.charges?.data?.[0];
    const paymentMethod = paymentIntent.payment_method_details?.card;

    // 3. Prepare payment details
    const paymentDetails = {
      method: 'card',
      amount: amount / 100, 
      transactionId: paymentIntentId,
      status: 'completed',
      currency: paymentIntent.currency,
      paymentDate: new Date(),
      receiptUrl: charge?.receipt_url || null,
      cardDetails: paymentMethod ? {
        brand: paymentMethod.brand,
        last4: paymentMethod.last4
      } : undefined
    };

    // 4. Update booking
    const updateData = {
      status: 'confirmed',
      paymentId: paymentIntentId,
      paymentStatus: 'completed',
      paymentMethod: 'card',
      paymentDetails
    };

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      booking,
      receiptUrl: paymentDetails.receiptUrl 
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      error: 'Payment confirmation failed',
      details: error.message 
    });
  }
};

// Webhook handler for Stripe events
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      try {
        await Booking.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          {
            paymentStatus: 'completed',
            'paymentDetails.status': 'completed',
            status: 'confirmed'
          }
        );
        console.log('PaymentIntent was successful and booking updated:', paymentIntent.id);
      } catch (err) {
        console.error('Error updating booking from webhook:', err);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      try {
        await Booking.findOneAndUpdate(
          { paymentId: failedPayment.id },
          {
            paymentStatus: 'failed',
            'paymentDetails.status': 'failed'
          }
        );
        console.log('Payment failed and booking updated:', failedPayment.id);
      } catch (err) {
        console.error('Error updating failed payment booking:', err);
      }
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook
};