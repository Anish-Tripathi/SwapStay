import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingApi from "../../../services/bookingApi";
import { useGuestHouse } from "../GuestHouseContext";
import { toast } from "react-toastify";

interface PaymentDetails {
  method: "card" | "upi" | "cash";
  paymentIntentId?: string;
  upiTransactionId?: string;
}

interface BookingFormDetails {
  checkInDate: string;
  numberOfDays: number;
  numberOfGuests: number;
  totalCost: number;
  studentName?: string;
  guestNames: string | string[];
}

export function useBookingState() {
  const [paymentStep, setPaymentStep] = useState<
    "method" | "details" | "processing" | "complete"
  >("method");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "cash" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { closeBookingDialog, selectedRoom, selectedGuestHouse } =
    useGuestHouse();
  const navigate = useNavigate();

  const handleProceedToPayment = async (formDetails: BookingFormDetails) => {
    try {
      setIsLoading(true);
      setError(null);

      const checkInDate = new Date(formDetails.checkInDate);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + formDetails.numberOfDays);

      const bookingData = {
        roomId: selectedRoom?._id,
        guestHouseId: selectedGuestHouse?._id,
        checkInDate: formDetails.checkInDate,
        checkOutDate: checkOutDate.toISOString(),
        totalPrice: formDetails.totalCost,
        numberOfGuests: formDetails.numberOfGuests,
        guestNames: Array.isArray(formDetails.guestNames)
          ? formDetails.guestNames
          : formDetails.guestNames.split(",").map((name) => name.trim()),
        roomDetails: {
          name: selectedRoom?.name,
          type: selectedRoom?.type,
          capacity: selectedRoom?.capacity,
          price: selectedRoom?.price,
          number: selectedRoom?.number,
        },
      };

      const response = await bookingApi.createBooking(bookingData);
      setBookingId(response._id);

      navigate("/payment", {
        state: {
          bookingDetails: {
            roomNumber: selectedRoom?.number,
            numberOfGuests: formDetails.numberOfGuests,
            numberOfDays: formDetails.numberOfDays,
            totalCost: formDetails.totalCost,
            studentName: formDetails.studentName,
            guestNames: Array.isArray(formDetails.guestNames)
              ? formDetails.guestNames.join(", ")
              : formDetails.guestNames,
            guestHouseName: selectedGuestHouse?.name,
            roomPrice: selectedRoom?.price,
            bookingId: response._id,
            checkInDate: formDetails.checkInDate,
            checkOutDate: checkOutDate.toISOString().split("T")[0],
          },
        },
      });

      closeBookingDialog();
    } catch (err: any) {
      setError(err.message || "Failed to process booking. Please try again.");
      toast.error(err.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (paymentDetails: PaymentDetails) => {
    if (!bookingId) {
      setError("No booking ID found");
      return;
    }

    try {
      setIsLoading(true);
      setPaymentStep("processing");
      setError(null);

      const response = await bookingApi.processPayment(
        bookingId,
        paymentDetails
      );

      setPaymentStep("complete");
      return response;
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setPaymentStep("method");
      toast.error(err.message || "Payment failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onStripePayment = async (paymentIntentId: string) => {
    return processPayment({
      method: "card",
      paymentIntentId,
    });
  };

  const onPaymentSuccess = (method: "card" | "upi" | "cash") => {
    toast.success(
      `${method === "card" ? "Card" : method.toUpperCase()} payment successful!`
    );
    setPaymentStep("complete");
  };

  return {
    paymentStep,
    setPaymentStep,
    paymentMethod,
    setPaymentMethod,
    isLoading,
    error,
    handleProceedToPayment,
    processPayment,
    onStripePayment,
    onPaymentSuccess,
    bookingId,
  };
}
