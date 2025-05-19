import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BlockTypeTabs from "./BlockTypeTabs";
import RoomFilters from "./RoomFilters";
import RoomGrid from "./RoomGrid";
import RoomListingCard from "./RoomListing";
import RoomNotAvailableMessage from "./RoomNotAvailableMessage";

const RoomRender = ({
  loading,
  hasListing,
  userRoom,
  theme,
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  blocks,
  floors,
  wings,
  error,
  filteredRooms,
  API_URL,
  currentImageIndex,
  pendingSwapRequests,
  incomingSwapRequests,
  setSelectedRoom,
  setCurrentImageIndex,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-purple-600">Loading rooms...</span>
      </div>
    );
  }

  if (!hasListing) {
    return <RoomListingCard />;
  }

  if (userRoom && !userRoom.availableForSwap) {
    return <RoomNotAvailableMessage theme={theme} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1
          className={`text-4xl font-bold ${
            theme === "dark" ? "text-purple-300" : "text-purple-900"
          } mb-2`}
        >
          Browse Rooms
        </h1>
        <p
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } max-w-2xl mx-auto`}
        >
          Find and swap your hostel room with other students. View details, chat
          with current occupants, and request swaps.
        </p>
      </div>

      <div className="mb-8">
        <BlockTypeTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setFilters={setFilters}
          theme={theme}
        />

        <div className="text-black">
          <RoomFilters
            onFilterChange={(filterValues) => {
              setFilters({
                ...filters,
                ...filterValues,
              });
            }}
            blocks={blocks}
            floors={floors}
            wings={wings}
            activeTab={activeTab}
          />
        </div>
      </div>

      {error ? (
        <div className="flex justify-center p-8">
          <Card className="w-full max-w-3xl">
            <CardContent className="pt-6">
              <p
                className={`text-center ${
                  theme === "dark" ? "text-red-400" : "text-red-500"
                }`}
              >
                {error}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <RoomGrid
          filteredRooms={filteredRooms}
          theme={theme}
          API_URL={API_URL}
          currentImageIndex={currentImageIndex}
          pendingSwapRequests={pendingSwapRequests}
          incomingSwapRequests={incomingSwapRequests}
          setSelectedRoom={setSelectedRoom}
          prevImage={(roomId, imagesLength) => {
            setCurrentImageIndex((prev) => ({
              ...prev,
              [roomId]: (prev[roomId] - 1 + imagesLength) % imagesLength,
            }));
          }}
          nextImage={(roomId, imagesLength) => {
            setCurrentImageIndex((prev) => ({
              ...prev,
              [roomId]: (prev[roomId] + 1) % imagesLength,
            }));
          }}
        />
      )}
    </div>
  );
};

export default RoomRender;
