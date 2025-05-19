import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcPaypal,
} from "react-icons/fa";
import { SiPaytm } from "react-icons/si";
import QRCode from "react-qr-code";
import axios from "axios";
import { toast } from "react-toastify";

interface BookingDetails {
  totalCost: number;
  bookingId: string;
}

interface Props {
  paymentMethod: "card" | "upi" | "cash";
  bookingDetails: BookingDetails;
  onPaymentSuccess: (method: "card" | "upi" | "cash") => void;
  qrValue: string;
  onStripePayment: (paymentIntentId: string) => Promise<void>;
}

const PaymentMethodSection: React.FC<Props> = ({
  paymentMethod,
  bookingDetails,
  onPaymentSuccess,
  qrValue,
  onStripePayment,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { data } = await axios.post<{ clientSecret: string }>(
        "/api/payment/create-payment-intent",
        {
          amount: bookingDetails.totalCost,
          currency: "inr",
          bookingId: bookingDetails.bookingId,
        }
      );

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
          return_url: window.location.origin + "/payment/success",
        });

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent?.status === "succeeded") {
        await onStripePayment(paymentIntent.id);
        onPaymentSuccess("card");
      }
    } catch (err) {
      setError(err.message || "Payment failed");
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <>
      {paymentMethod === "card" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-fade-in dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
            <CreditCard className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Pay with Credit or Debit Card
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Card Details
              </label>
              <div className="border border-gray-300 rounded-lg p-3 dark:border-gray-600 dark:bg-gray-800">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleCardPayment}
            disabled={!stripe || processing}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              processing
                ? "bg-indigo-400 cursor-not-allowed dark:bg-indigo-500"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
            } text-white transition-colors`}
          >
            {processing ? "Processing..." : `Pay ₹${bookingDetails.totalCost}`}
          </button>
          <div className="flex justify-center gap-12 mt-6 text-purple-800 dark:text-purple-400">
            <a
              href="https://www.visa.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                alt="Visa"
                className="w-16 h-8 hover:opacity-75 transition-opacity"
                title="Visa"
              />
            </a>
            <a
              href="https://www.mastercard.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                alt="Mastercard"
                className="w-10 h-10 hover:opacity-75 transition-opacity"
                title="Mastercard"
              />
            </a>
            <a
              href="https://www.americanexpress.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1024px-American_Express_logo.svg.png"
                alt="American Express"
                className="w-14 h-10 hover:opacity-75 transition-opacity"
                title="American Express"
              />
            </a>
            <a
              href="https://www.discover.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://logodix.com/logo/780291.jpg"
                alt="Discover"
                className="w-14 h-10 hover:opacity-75 transition-opacity"
                title="Discover"
              />
            </a>
            <a
              href="https://www.paytm.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/640px-Paytm_logo.png"
                alt="Paytm"
                className="w-16 h-10 hover:opacity-75 transition-opacity"
                title="Paytm"
              />
            </a>
            <a
              href="https://www.paypal.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png"
                alt="PayPal"
                className="w-16 h-11 hover:opacity-75 transition-opacity"
                title="PayPal"
              />
            </a>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6 flex items-start dark:bg-gray-600">
            <div className="text-green-600 mr-3 mt-1 dark:text-green-400">
              <ShieldIcon />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 text-sm dark:text-gray-200">
                Secure Payment
              </h4>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">
                Your payment information is processed securely by Stripe. We
                never store your card details.
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-fade-in dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
            <Smartphone className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Pay using UPI
          </h3>

          <div className="flex flex-col items-center justify-center mb-4">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-gray-800">
              <QRCode value={qrValue} size={180} level="H" fgColor="#4F46E5" />
            </div>

            <p className="text-center text-sm text-gray-600 mb-3 dark:text-gray-300">
              Scan the QR code using any UPI app to pay
            </p>

            <div className="flex items-center justify-center mb-2">
              {[
                {
                  src: "https://static.vecteezy.com/system/resources/previews/021/515/020/original/google-pay-logo-symbol-design-illustration-free-vector.jpg",
                  alt: "Google Pay",
                },
                {
                  src: "https://logotaglines.com/wp-content/uploads/2021/11/PhonePe-Logo-Tagline-Slogan-Owner-Founder.jpg",
                  alt: "PhonePe",
                },
                {
                  src: "https://static.vecteezy.com/system/resources/previews/020/190/501/original/paytm-logo-paytm-icon-free-free-vector.jpg",
                  alt: "Paytm",
                },
                {
                  src: "https://th.bing.com/th/id/OIP.znKLafAA4DeDFE-dy2U4kQHaFD?r=0&cb=iwp2&w=1080&h=737&rs=1&pid=ImgDetMain",
                  alt: "BHIM",
                },
              ].map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  className="w-16 h-16 mx-3"
                  style={{ objectFit: "contain" }}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-gray-600">
            <p className="text-sm text-gray-600 text-center mb-3 dark:text-gray-300">
              Or enter your UPI ID directly
            </p>
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-400"
                placeholder="yourname@upi"
              />
              <button className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800">
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "cash" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-fade-in dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-200">
            <Banknote className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Pay with Cash
          </h3>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded dark:bg-amber-900/30 dark:border-amber-400">
            <p className="text-amber-700 dark:text-amber-200">
              You will need to pay ₹{bookingDetails.totalCost} in cash at the
              guest house reception.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-600">
            <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-200">
              Important Information:
            </h4>
            <ul className="text-sm text-gray-600 space-y-2 dark:text-gray-300">
              {[
                "Payment must be made within 24 hours of booking.",
                "Please carry the exact amount as change may not be available.",
                "A receipt will be provided upon payment.",
                "Your booking will be confirmed only after payment is received.",
              ].map((note, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-indigo-500 mr-2 dark:text-indigo-400">
                    •
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

const ShieldIcon = () => (
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
);

export default PaymentMethodSection;
