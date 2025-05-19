import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import RoomCard from "./RoomCard";
import { useGuestHouse } from "./GuestHouseContext";

const RoomDetails = () => {
  const { selectedGuestHouse, setSelectedGuestHouse } = useGuestHouse();

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6 dark:text-gray-200 dark:hover:bg-gray-800"
        onClick={() => setSelectedGuestHouse(null)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guest Houses
      </Button>

      <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-6">
        {selectedGuestHouse?.name} - Available Rooms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedGuestHouse?.rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
