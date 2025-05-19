import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import guestHouseService from "../../services/bookingApi";

interface DateFilter {
  checkIn: string;
  checkOut: string;
}

const GuestHouseContext = createContext(null);

export const GuestHouseProvider = ({ children }) => {
  const [guestHouses, setGuestHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuestHouse, setSelectedGuestHouse] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize with proper date validation
  const [dateFilter, setDateFilter] = useState<DateFilter>(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      checkIn: today.toISOString().split("T")[0],
      checkOut: tomorrow.toISOString().split("T")[0],
    };
  });

  // Unified fetch function with error handling
  const fetchData = useCallback(async (fetchFunction, ...args) => {
    try {
      setIsLoading(true);
      const data = await fetchFunction(...args);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch data. Please try again later.");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all guest houses
  const fetchGuestHouses = useCallback(async () => {
    const data = await fetchData(
      guestHouseService.getAllGuestHouses,
      dateFilter.checkIn,
      dateFilter.checkOut
    );
    setGuestHouses(data);
  }, [dateFilter, fetchData]);

  // Fetch single guest house details
  const fetchGuestHouseDetails = useCallback(async () => {
    if (!selectedGuestHouse?._id) return;

    const data = await fetchData(
      guestHouseService.getGuestHouseById,
      selectedGuestHouse._id,
      dateFilter.checkIn,
      dateFilter.checkOut
    );
    setSelectedGuestHouse(data);
  }, [selectedGuestHouse?._id, dateFilter, fetchData]);

  // Main data fetching effect
  useEffect(() => {
    fetchGuestHouses();
  }, [fetchGuestHouses]);

  // Fetch details when guest house or dates change
  useEffect(() => {
    fetchGuestHouseDetails();
  }, [fetchGuestHouseDetails]);

  // Date validation when filter changes
  useEffect(() => {
    const checkInDate = new Date(dateFilter.checkIn);
    const checkOutDate = new Date(dateFilter.checkOut);

    if (checkOutDate <= checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);

      setDateFilter((prev) => ({
        ...prev,
        checkOut: nextDay.toISOString().split("T")[0],
      }));
    }
  }, [dateFilter.checkIn, dateFilter.checkOut]);

  const openBookingDialog = (room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoom(null);
  };

  return (
    <GuestHouseContext.Provider
      value={{
        guestHouses,
        isLoading,
        error,
        selectedGuestHouse,
        setSelectedGuestHouse,
        selectedRoom,
        setSelectedRoom,
        bookingDetails,
        setBookingDetails,
        isDialogOpen,
        openBookingDialog,
        closeBookingDialog,
        dateFilter,
        setDateFilter,
      }}
    >
      {children}
    </GuestHouseContext.Provider>
  );
};

export const useGuestHouse = () => useContext(GuestHouseContext);
