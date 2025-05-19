import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useGuestHouse } from "./GuestHouseContext";

const GuestHouseCard = ({ guestHouse }) => {
  const { setSelectedGuestHouse } = useGuestHouse();

  return (
    <motion.div
      key={guestHouse._id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900 transition-all"
    >
      <img
        src={guestHouse.image}
        alt={guestHouse.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-2">
          {guestHouse.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {guestHouse.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {guestHouse.features.map((feature) => (
            <Badge
              key={`${guestHouse._id}-${feature}`}
              variant="secondary"
              className="dark:bg-gray-700 dark:text-white"
              style={{ color: "white" }}
            >
              {feature}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Available Rooms: {guestHouse.availableRoomCount} /{" "}
          {guestHouse.totalRooms}
        </p>
        <Button
          className="w-full dark:bg-purple-700 dark:hover:bg-purple-600 dark:text-white"
          onClick={() => {
            setSelectedGuestHouse(guestHouse);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Explore Rooms
        </Button>
      </div>
    </motion.div>
  );
};

export default GuestHouseCard;
