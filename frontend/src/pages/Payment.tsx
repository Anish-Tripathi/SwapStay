import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import PaymentForm from "../components/payment/PaymentForm";
import Receipt from "../components/payment/Receipt";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export type PaymentMethodType = "card" | "upi" | "cash";

interface BookingDetails {
  roomNumber: string | number;
  numberOfGuests: number;
  numberOfDays: number;
  totalCost: number;
  studentName?: string;
  guestNames?: string;
  guestHouseName?: string;
  roomPrice?: number;
  bookingId: string;
  checkInDate?: string;
  checkOutDate?: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails: BookingDetails = location.state?.bookingDetails || {
    roomNumber: "A-204",
    numberOfGuests: 2,
    numberOfDays: 3,
    totalCost: 4500,
    studentName: "Sarah Johnson",
    guestNames: "Mike Parker, Lisa Wong",
    guestHouseName: "Sunset Heights",
    roomPrice: 1500,
    bookingId: "temp_booking_id",
  };
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [activeStep, setActiveStep] = useState(1);

  const handlePaymentSuccess = (method: PaymentMethodType) => {
    setShowReceipt(true);
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={5000} />
      <div className="min-h-screen bg-purple-200 py-12 px-4 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-4xl mx-auto">
          {!showReceipt ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                bookingDetails={bookingDetails}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setShowReceipt={setShowReceipt}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          ) : (
            <Receipt
              bookingDetails={bookingDetails}
              paymentMethod={paymentMethod}
              navigate={navigate}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
