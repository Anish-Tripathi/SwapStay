import React, { useState } from "react";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import stripePromise from "@/lib/initStripe";
import { Loader2, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import api from "../../lib/axiosConfig";
import { useNavigate } from "react-router-dom";

type PaymentStatus = "idle" | "processing" | "succeeded" | "failed";

interface BookingData {
  id?: string;
  userId: string;
  roomId: string;
  guestHouseId: string;
  checkInDate: string;
  checkOutDate: string;
  studentName: string;
  numberOfGuests: number;
  guestNames: string;
  totalPrice: number;
}

interface BookingDetails {
  roomNumber: string;
  numberOfGuests: number;
  numberOfDays: number;
  totalCost: number;
  studentName: string;
  guestNames: string;
  guestHouseName: string;
  roomPrice: number;
  bookingData: BookingData;
}

interface StripePaymentWrapperProps {
  bookingDetails: BookingDetails;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentFailure?: (error: any) => void;
}

const CardPaymentForm: React.FC<StripePaymentWrapperProps> = ({
  bookingDetails,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  const cardElementStyle: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Arial, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 0",
      },
      invalid: {
        color: "#9e2146",
        iconColor: "#9e2146",
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setStatus("processing");
    setError(null);

    try {
      // Step 1: Create payment intent
      const { data } = await api.post("/api/payment/create-payment-intent", {
        amount: bookingDetails.totalCost,
        currency: "inr",
        bookingId: bookingDetails.bookingData?.id,
      });

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: bookingDetails.studentName,
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent?.status === "succeeded") {
        setPaymentIntent(paymentIntent);
        setStatus("succeeded");

        // Step 3: Confirm with backend
        try {
          if (!bookingDetails.bookingData.id) {
            // Create booking if it doesn't exist
            const bookingResponse = await api.post(
              "/api/bookings",
              bookingDetails.bookingData
            );
            bookingDetails.bookingData.id = bookingResponse.data.booking._id;
          }

          // Confirm payment with backend
          await api.post("/api/payment/confirm-payment", {
            paymentIntentId: paymentIntent.id,
            bookingId: bookingDetails.bookingData.id,
          });

          if (onPaymentSuccess) {
            onPaymentSuccess(paymentIntent);
          }

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/booking-confirmation", {
              state: {
                bookingId: bookingDetails.bookingData.id,
                paymentId: paymentIntent.id,
              },
            });
          }, 3000);
        } catch (confirmError) {
          console.error("Backend confirmation failed:", confirmError);
          // Payment succeeded but backend confirmation failed
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setStatus("failed");
      setError(err.message || "Payment failed. Please try again.");

      if (onPaymentFailure) {
        onPaymentFailure(err);
      }
    }
  };

  if (status === "succeeded") {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          Your payment of ₹{bookingDetails.totalCost} has been processed.
        </p>
        <p className="text-sm text-gray-500">
          You'll be redirected to your booking confirmation shortly...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <CardElement options={cardElementStyle} />
        </div>
      </div>

      {/* Payment logos */}
      <div className="flex justify-center space-x-4 mb-6">
        {["196578", "196561", "196539", "196565"].map((id) => (
          <img
            key={id}
            src={`https://cdn-icons-png.flaticon.com/512/196/${id}.png`}
            alt="Card Logo"
            className="h-8 w-auto"
          />
        ))}
      </div>

      {/* Security info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="text-green-600 mr-3 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 text-sm">
              Secure Payment
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Your payment information is encrypted and processed securely by
              Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {status === "failed" && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
          <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Payment Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || status === "processing"}
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "processing" ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </div>
        ) : (
          `Pay ₹${bookingDetails.totalCost}`
        )}
      </button>
    </form>
  );
};

const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = (props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
        Pay with Credit or Debit Card
      </h3>

      <Elements stripe={stripePromise}>
        <CardPaymentForm {...props} />
      </Elements>
    </div>
  );
};

export default StripePaymentWrapper;
