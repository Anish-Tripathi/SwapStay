import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath } from "lucide-react";
import { motion } from "framer-motion";
import { useGuestHouse } from "./GuestHouseContext";

const RoomCard = ({ room }) => {
  const { openBookingDialog } = useGuestHouse();

  return (
    <motion.div
      key={room._id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden dark:shadow-gray-900"
    >
      <img
        src={room.image}
        alt={`Room ${room.number}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 dark:text-white">
          Room {room.number}
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 dark:text-gray-300" />
            <span className="text-sm dark:text-gray-300">{room.beds} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 dark:text-gray-300" />
            <span className="text-sm dark:text-gray-300">
              {room.bathrooms} Bathroom
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {room.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.features.map((feature) => (
            <Badge
              key={feature}
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-300"
            >
              {feature}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-purple-900 dark:text-purple-300 font-semibold">
            ₹{room.price}/night
          </p>
          <Badge className="dark:bg-gray-700 dark:text-gray-200">
            {room.capacity} Persons
          </Badge>
        </div>
        <Button
          className="w-full dark:bg-purple-700 dark:hover:bg-purple-600 dark:text-white"
          onClick={() => openBookingDialog(room)}
        >
          Book Now
        </Button>
      </div>
    </motion.div>
  );
};

export default RoomCard;
