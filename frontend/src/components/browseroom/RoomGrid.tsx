import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAmenityLabel, RoomGridProps } from "./types/about";

const RoomGrid = ({
  filteredRooms,
  theme,
  API_URL,
  currentImageIndex,
  pendingSwapRequests,
  incomingSwapRequests,
  setSelectedRoom,
  prevImage,
  nextImage,
}: RoomGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (filteredRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No rooms available for swap at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentRooms.map((room) => (
          <Card
            key={room._id}
            className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
              theme === "dark" ? "bg-slate-800 border-slate-700" : ""
            }`}
          >
            <div className="relative mt-5">
              {room.images && room.images.length > 0 ? (
                <>
                  <img
                    src={`${API_URL}${
                      room.images[currentImageIndex[room._id] || 0]
                    }`}
                    alt={`Room ${room.roomNumber} in ${room.blockName}`}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        (e.target as HTMLImageElement).src
                      );
                      (
                        e.target as HTMLImageElement
                      ).src = `${API_URL}/images/default-room.png`;
                    }}
                  />
                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(room._id, room.images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(room._id, room.images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {room.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              currentImageIndex[room._id] === idx
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className={`w-full h-52 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } flex items-center justify-center`}
                >
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No image available
                  </p>
                </div>
              )}
              <Badge className="absolute top-3 right-3 bg-purple-700">
                {room.sharing}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle
                className={`text-xl ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                {room.blockName} - Room {room.roomNumber}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    theme === "dark"
                      ? "text-gray-300 border-gray-600"
                      : "text-gray-700"
                  }`}
                >
                  {room.blockType}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    theme === "dark"
                      ? "text-gray-300 border-gray-600"
                      : "text-gray-700"
                  }`}
                >
                  Floor {room.floor}
                </Badge>
                {room.wing && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      theme === "dark"
                        ? "text-gray-300 border-gray-600"
                        : "text-gray-700"
                    }`}
                  >
                    Wing {room.wing}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } space-y-2`}
            >
              <p className="text-sm line-clamp-2 mb-3">
                {room.description || "No description provided"}
              </p>

              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs text-white"
                    >
                      {getAmenityLabel(amenity)}
                    </Badge>
                  ))}
                  {room.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs text-white">
                      +{room.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div
                className={`flex items-center gap-2 text-sm pt-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <Avatar className="w-11 h-11 bg-purple-200">
                  {room.owner?.profilePicture ? (
                    <AvatarImage
                      src={`${API_URL}${room.owner.profilePicture}`}
                      alt={room.owner?.name || "Anonymous"}
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error(
                          "Profile image failed to load:",
                          target.src
                        );
                        target.style.display = "none";
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="fallback text-xs bg-purple-700 text-white">
                    {room.owner?.name
                      ? room.owner.name
                          .split(" ")
                          .map((n) => n[0].toUpperCase())
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>

                <span>
                  Occupied by:{" "}
                  <strong>{room.owner?.name || "Anonymous"}</strong>
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              {pendingSwapRequests.includes(room._id) ? (
                <div className="w-full p-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-center">
                  Swap request pending
                </div>
              ) : incomingSwapRequests.includes(room._id) ? (
                <div className="w-full p-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-center">
                  Swap request received
                </div>
              ) : null}

              <Button
                onClick={() => setSelectedRoom(room)}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((prev) => {
                const newPage = Math.max(prev - 1, 1);

                return newPage;
              });
            }}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentPage(page);
                }}
                className="w-10 h-10 p-0 flex items-center justify-center"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((prev) => {
                const newPage = Math.min(prev + 1, totalPages);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return newPage;
              });
            }}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
