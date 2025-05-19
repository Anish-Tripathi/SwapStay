import { Button } from "@/components/ui/button";
import GuestHouseCard from "./GuestHouseCard";
import { useGuestHouse } from "./GuestHouseContext";

const GuestHouseOverview = () => {
  const {
    isLoading,
    guestHouses,
    dateFilter,
    setDateFilter,
    fetchGuestHouses,
  } = useGuestHouse();

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={dateFilter.checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, checkIn: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              value={dateFilter.checkOut}
              min={dateFilter.checkIn}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, checkOut: e.target.value })
              }
            />
          </div>
          <div className="self-end">
            <Button
              className="w-full md:w-auto dark:bg-purple-700 dark:hover:bg-purple-600"
              onClick={fetchGuestHouses}
            >
              Search Availability
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : guestHouses.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No guest houses available for selected dates
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try different dates or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guestHouses.map((guestHouse) => (
            <GuestHouseCard key={guestHouse._id} guestHouse={guestHouse} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestHouseOverview;
