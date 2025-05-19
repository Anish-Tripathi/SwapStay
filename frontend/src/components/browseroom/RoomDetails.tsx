import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomDetailsProps } from "./types/about";

export const RoomDetails = ({
  selectedRoom,
  theme,
  currentImageIndex,
  activeIndex,
  prevImage,
  nextImage,
  API_URL,
  getAmenityLabel,
}: RoomDetailsProps) => {
  return (
    <div className="py-4">
      <div className="relative mb-6">
        {selectedRoom.images && selectedRoom.images.length > 0 ? (
          <>
            <img
              src={`${API_URL}${
                selectedRoom.images[currentImageIndex[selectedRoom._id] || 0]
              }`}
              alt={`Room ${selectedRoom.roomNumber} in ${selectedRoom.blockName}`}
              className="w-full h-64 object-contain rounded-lg"
              onError={(e) => {
                console.error(
                  "Image failed to load:",
                  (e.target as HTMLImageElement).src
                );
                (
                  e.target as HTMLImageElement
                ).src = `${API_URL}/images/default-room.jpg`;
              }}
            />
            {selectedRoom.images.length > 1 && (
              <>
                <button
                  onClick={() => prevImage()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <button
                  onClick={() => nextImage()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {selectedRoom.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        activeIndex === idx ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            className={`w-full h-64 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } rounded-lg flex items-center justify-center`}
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
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-3 mb-6 ${
            theme === "dark" ? "bg-purple-950" : "bg-purple-100"
          } p-1 rounded-lg shadow-lg`}
        >
          <TabsTrigger
            value="details"
            className={`${
              theme === "dark" ? "text-purple-300" : "text-purple-700"
            } data-[state=active]:bg-purple-700 
         data-[state=active]:text-white data-[state=active]:shadow-md 
         px-4 py-2 rounded-md transition-all`}
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className={`${
              theme === "dark" ? "text-purple-300" : "text-purple-700"
            } data-[state=active]:bg-purple-700 
         data-[state=active]:text-white data-[state=active]:shadow-md 
         px-4 py-2 rounded-md transition-all`}
          >
            Amenities
          </TabsTrigger>
          <TabsTrigger
            value="occupant"
            className={`${
              theme === "dark" ? "text-purple-300" : "text-purple-700"
            } data-[state=active]:bg-purple-700 
         data-[state=active]:text-white data-[state=active]:shadow-md 
         px-4 py-2 rounded-md transition-all`}
          >
            Occupant
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Block
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedRoom.blockName}
              </p>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Type
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedRoom.blockType}
              </p>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Room Number
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedRoom.roomNumber}
              </p>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Location
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedRoom.floor}, {selectedRoom.wing || "N/A"}
              </p>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Sharing
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedRoom.sharing}
              </p>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Posted
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {new Date(selectedRoom.datePosted).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div
            className={`${
              theme === "dark" ? "bg-slate-700" : "bg-purple-50"
            } p-3 rounded-lg`}
          >
            <h4
              className={`font-medium ${
                theme === "dark" ? "text-purple-300" : "text-purple-900"
              }`}
            >
              Description
            </h4>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {selectedRoom.description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-2">
          <div
            className={`${
              theme === "dark" ? "bg-slate-700" : "bg-purple-50"
            } p-4 rounded-lg`}
          >
            <h4
              className={`font-medium ${
                theme === "dark" ? "text-purple-300" : "text-purple-900"
              } mb-3`}
            >
              Available Amenities
            </h4>
            {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedRoom.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-700"></div>
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {getAmenityLabel(amenity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No amenities listed
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="occupant" className="space-y-2">
          <div
            className={`${
              theme === "dark" ? "bg-slate-700" : "bg-purple-50"
            } p-4 rounded-lg flex items-center gap-4`}
          >
            <Avatar className="w-12 h-12 bg-purple-200">
              {selectedRoom.owner?.profilePicture && (
                <AvatarImage
                  src={`${API_URL}${selectedRoom.owner.profilePicture}`}
                  alt={selectedRoom.owner?.name || "Anonymous"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log("Image failed to load:", target.src);
                    target.style.display = "none";
                    target.parentElement
                      ?.querySelector(".fallback")
                      ?.setAttribute("style", "display: flex");
                  }}
                />
              )}
              <AvatarFallback className="text-xs bg-purple-700 text-white">
                {selectedRoom.owner?.name
                  ? selectedRoom.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                {selectedRoom.owner?.name || "Anonymous"}
              </h4>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Current Occupant
              </p>
              <p className="mt-2 text-sm font-medium text-green-600">
                Available for swap
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
