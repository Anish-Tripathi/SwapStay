import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentStepper from "./PaymentStepper";
import PaymentMethodSelector from "./PaymentMethodSelector";
import OrderSummaryCard from "./OrderSummaryCard";
import PaymentHeader from "./PaymentHeader";
import PaymentActions from "./PaymentActions";
import PaymentMethodSection from "./PaymentMethodSection";
import bookingApi from "../../services/bookingApi";
import { useToast } from "../../components/ui/use-toast";

export type PaymentMethodType = "card" | "upi" | "cash";

interface PaymentFormProps {
  bookingDetails: {
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
  };
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  setShowReceipt: (show: boolean) => void;
  onPaymentSuccess: (method: PaymentMethodType) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingDetails,
  paymentMethod,
  setPaymentMethod,
  activeStep,
  setActiveStep,
  setShowReceipt,
  onPaymentSuccess,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [qrValue] = useState(
    `upi://pay?pa=swapstay@upi&pn=SwapStay&am=${bookingDetails.totalCost}&cu=INR&tn=Room${bookingDetails.roomNumber}`
  );

  const handlePaymentSuccess = (method: PaymentMethodType) => {
    window.scrollTo(0, 0);
    toast({
      title: "Payment Successful",
      description: `Payment processed via ${method.toUpperCase()}`,
      variant: "default",
      duration: 3000,
    });
    onPaymentSuccess(method);
  };

  const handlePayment = async () => {
    try {
      if (paymentMethod === "cash" || paymentMethod === "upi") {
        setIsProcessing(true);
        setActiveStep(2);

        const bookingId = bookingDetails.bookingId;
        if (!bookingId) throw new Error("Booking ID not found");

        const paymentDetails = {
          method: paymentMethod,
          details:
            paymentMethod === "upi"
              ? { upiId: "guesthouse@campusupi" }
              : { paymentLocation: "Guest House Reception" },
        };

        await bookingApi.processPayment(bookingId, paymentDetails);
        setIsProcessing(false);
        setActiveStep(3);
        setShowReceipt(true);
        handlePaymentSuccess(paymentMethod);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      setActiveStep(1);
      toast({
        title: "Payment Failed",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleStripePayment = async (paymentIntentId: string) => {
    try {
      setIsProcessingStripe(true);
      setActiveStep(2);

      await bookingApi.processPayment(bookingDetails.bookingId, {
        method: "card",
        paymentIntentId,
        amount: bookingDetails.totalCost,
      });

      setIsProcessingStripe(false);
      setActiveStep(3);
      setShowReceipt(true);
      handlePaymentSuccess("card");
    } catch (error) {
      setIsProcessingStripe(false);
      setActiveStep(1);
      toast({
        title: "Payment Failed",
        description: error.message || "Payment confirmation failed",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    }
  };

  return (
    <div className=" min-h-screen">
      <PaymentStepper activeStep={activeStep} />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
        <PaymentHeader />

        <div className="p-8 dark:bg-gray-800">
          <OrderSummaryCard bookingDetails={bookingDetails} />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            onPaymentSuccess={() => handlePaymentSuccess(paymentMethod)}
            qrValue={qrValue}
            bookingDetails={bookingDetails}
            onStripePayment={handleStripePayment}
          />

          {paymentMethod !== "card" && (
            <PaymentActions
              onBack={() => navigate("/guest-house")}
              onPay={handlePayment}
              isProcessing={isProcessing || isProcessingStripe}
              totalCost={bookingDetails.totalCost}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
