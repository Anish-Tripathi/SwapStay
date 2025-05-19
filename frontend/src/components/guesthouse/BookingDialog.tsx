import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useBookingState } from "./hooks/useBookingState";
import { useGuestHouse } from "./GuestHouseContext";

const BookingDialog = () => {
  const {
    isDialogOpen,
    selectedRoom,
    bookingDetails,
    closeBookingDialog,
    selectedGuestHouse,
  } = useGuestHouse();
  const { handleProceedToPayment } = useBookingState();

  const initialFormValues = {
    studentName: bookingDetails?.studentName || "",
    numberOfGuests: bookingDetails?.numberOfGuests || 1,
    guestNames: Array.isArray(bookingDetails?.guestNames)
      ? bookingDetails.guestNames
      : (bookingDetails?.guestNames || "")
          .split(",")
          .filter((name: string) => name.trim()),
    numberOfDays: bookingDetails?.numberOfDays || 1,
    roomNumber: selectedRoom?.number || "",
    roomPrice: selectedRoom?.price || 0,
    guestHouseName: selectedGuestHouse?.name || "",
    checkInDate:
      bookingDetails?.checkInDate || new Date().toISOString().split("T")[0],
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const studentNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDialogOpen && studentNameInputRef.current) {
      studentNameInputRef.current.focus();
    }
  }, [isDialogOpen]);

  // Update guest names array when number of guests changes
  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      guestNames: Array.from(
        { length: prev.numberOfGuests || 1 },
        (_, i) => prev.guestNames[i] || ""
      ),
    }));
  }, [formValues.numberOfGuests]);

  // Only render the dialog if it's open and a room is selected
  if (!isDialogOpen || !selectedRoom) return null;

  // Handle changes to form fields
  const handleLocalChange = (field: keyof typeof formValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes to guest names
  const handleGuestNamesChange = (index: number, value: string) => {
    const newGuestNames = [...formValues.guestNames];
    newGuestNames[index] = value;
    setFormValues((prev) => ({ ...prev, guestNames: newGuestNames }));
  };

  // Calculate total cost
  const calculateLocalTotal = () => {
    return formValues.numberOfDays * (selectedRoom?.price || 0);
  };

  // Submit form handler
  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalCost = formValues.numberOfDays * selectedRoom.price;
      const formattedGuestNames = Array.isArray(formValues.guestNames)
        ? formValues.guestNames.join(", ")
        : formValues.guestNames;

      const finalDetails = {
        ...formValues,
        guestNames: formattedGuestNames,
        totalCost,
        roomNumber: selectedRoom.number,
        roomPrice: selectedRoom.price,
        guestHouseName: selectedGuestHouse?.name || "",
        roomDetails: {
          name: selectedRoom.name,
          type: selectedRoom.type,
          capacity: selectedRoom.capacity,
          price: selectedRoom.price,
          number: selectedRoom.number,
        },
      };

      await handleProceedToPayment(finalDetails);
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      alert("Failed to proceed to payment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out hover:scale-105">
        <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">
          Book Room {selectedRoom.number}
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please fill in the details to continue with your booking
        </p>

        <form onSubmit={handleLocalSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
              value={formValues.studentName}
              onChange={(e) => handleLocalChange("studentName", e.target.value)}
              ref={studentNameInputRef}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min={new Date().toISOString().split("T")[0]}
                value={formValues.checkInDate}
                onChange={(e) =>
                  handleLocalChange("checkInDate", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              min="1"
              max={selectedRoom.capacity}
              value={formValues.numberOfGuests}
              onChange={(e) =>
                handleLocalChange(
                  "numberOfGuests",
                  parseInt(e.target.value) || 1
                )
              }
              required
            />
          </div>

          {formValues.guestNames.map((name, index) => (
            <div key={index} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name {index + 1}
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={`Enter guest ${index + 1} name`}
                value={name}
                onChange={(e) => handleGuestNamesChange(index, e.target.value)}
                required={index === 0}
              />
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              min="1"
              value={formValues.numberOfDays}
              onChange={(e) =>
                handleLocalChange("numberOfDays", parseInt(e.target.value) || 1)
              }
              required
            />
          </div>

          <div className="mb-8 p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Room rate per day:</span>
              <span>₹{selectedRoom.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Number of days:</span>
              <span>{formValues.numberOfDays}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800 mt-3 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>₹{calculateLocalTotal().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
              onClick={closeBookingDialog}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDialog;
