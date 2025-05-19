import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RoomDetails, RoomDetailsSectionProps } from "./types/request";

export const RoomDetailsSection = ({
  selectedRequest,
}: RoomDetailsSectionProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2  dark:border-purple-700">
            <AvatarImage
              src={selectedRequest.avatar}
              alt={
                selectedRequest.requestType === "sent"
                  ? "You"
                  : selectedRequest.from
              }
            />
            <AvatarFallback className="bg-purple-800 text-white font-semibold">
              {(selectedRequest.to || "U")
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-200">
              {selectedRequest.status === "approved"
                ? selectedRequest.requestType === "sent"
                  ? `You successfully swapped room with ${selectedRequest.originalRequest?.recipient?.name}`
                  : `You swapped with ${selectedRequest.from}`
                : selectedRequest.requestType === "sent"
                ? `Your Request to ${selectedRequest.to}`
                : `Request from ${selectedRequest.from}`}
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {formatDate(selectedRequest.timestamp)} at{" "}
              {formatTime(selectedRequest.timestamp)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Room Card */}
        <div>
          <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-300">
            {selectedRequest.requestType === "sent"
              ? "Your Room"
              : "Their Room"}
          </h4>
          <RoomCard
            roomName={
              selectedRequest.requestType === "sent"
                ? selectedRequest.yourRoom
                : selectedRequest.roomDetails
            }
            imageUrl={`http://localhost:5000${
              selectedRequest.requesterRoomObj?.images?.[0] || ""
            }`}
            badgeText={
              selectedRequest.requestType === "sent"
                ? "Your Room"
                : "Their Room"
            }
            details={selectedRequest.requesterRoomObj}
            amenities={
              selectedRequest.requestType === "sent"
                ? selectedRequest.yourRoomAmenities
                : selectedRequest.roomAmenities
            }
          />
        </div>

        {/* Right Room Card */}
        <div>
          <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-300">
            {selectedRequest.requestType === "sent"
              ? "Requested Room"
              : "Your Room"}
          </h4>
          <RoomCard
            roomName={
              selectedRequest.requestType === "sent"
                ? selectedRequest.roomDetails
                : selectedRequest.yourRoom
            }
            imageUrl={`http://localhost:5000${
              selectedRequest.requestedRoomObj?.images?.[0] || ""
            }`}
            badgeText={
              selectedRequest.requestType === "sent"
                ? "Requested Room"
                : "Your Room"
            }
            details={selectedRequest.requestedRoomObj}
            amenities={
              selectedRequest.requestType === "sent"
                ? selectedRequest.roomAmenities
                : selectedRequest.yourRoomAmenities
            }
          />
        </div>
      </div>

      {/* Swap Reason */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-300">
          Swap Reason
        </h4>
        <Card className="border border-purple-200 dark:border-purple-800 shadow-sm">
          <CardContent className="pt-4 bg-white dark:bg-gray-900">
            <p className="italic text-purple-700 dark:text-purple-300">
              "{selectedRequest.reason}"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reason (if rejected) */}
      {selectedRequest.status === "rejected" && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-300">
            Rejection Reason
          </h4>
          <Card className="border border-red-200 dark:border-red-800 shadow-sm">
            <CardContent className="pt-4 bg-white dark:bg-gray-900">
              <p className="italic text-red-700 dark:text-red-300">
                "
                {selectedRequest.originalRequest?.rejectionReason ||
                  "No reason provided"}
                "
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requester Details (if received request) */}
      {selectedRequest.requestType === "received" &&
        selectedRequest.userDetails && (
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-300">
              Requester Details
            </h4>
            <Card className="border border-purple-200 dark:border-purple-800 shadow-sm">
              <CardContent className="pt-4 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Name
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Department
                    </p>
                    <p className="font-medium uppercase text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.department || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Year
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Student ID
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.studentId ||
                        selectedRequest.userDetails.rollNo ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Email
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Contact
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-200">
                      {selectedRequest.userDetails.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
};

const RoomCard = ({
  roomName,
  imageUrl,
  badgeText,
  details,
  amenities,
}: {
  roomName: string;
  imageUrl: string;
  badgeText: string;
  details?: RoomDetails;
  amenities?: string[];
}) => (
  <Card className="overflow-hidden rounded-lg border-0 shadow-md transition-all hover:shadow-lg dark:shadow-purple-900/20">
    <div className="relative h-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-30"></div>
      <img
        src={imageUrl}
        alt={badgeText}
        className="h-full w-full object-cover"
      />
      <div className="absolute top-3 left-3">
        <Badge className="bg-purple-600/90 text-white shadow-sm">
          {badgeText}
        </Badge>
      </div>
    </div>

    <CardContent className="pt-5 pb-6 px-5 bg-white dark:bg-gray-900">
      <h5 className="font-semibold text-lg text-purple-900 dark:text-purple-200 mb-3">
        {roomName}
      </h5>

      {(details?.floor || details?.wing || details?.sharing) && (
        <div className="grid grid-cols-2 gap-2 rounded-md bg-purple-50 dark:bg-purple-900/20 p-3 mb-4">
          {details?.floor && (
            <div>
              <p className="text-xs text-purple-500 dark:text-purple-400">
                Floor
              </p>
              <p className="font-medium text-purple-800 dark:text-purple-200">
                {details.floor}
              </p>
            </div>
          )}
          {details?.wing && (
            <div>
              <p className="text-xs text-purple-500 dark:text-purple-400">
                Wing
              </p>
              <p className="font-medium text-purple-800 dark:text-purple-200">
                {details.wing}
              </p>
            </div>
          )}
          {details?.sharing && (
            <div>
              <p className="text-xs text-purple-500 dark:text-purple-400">
                Sharing
              </p>
              <p className="font-medium text-purple-800 dark:text-purple-200">
                {details.sharing}
              </p>
            </div>
          )}
        </div>
      )}

      {details?.description && (
        <div className="mt-4 px-4 py-3 rounded-md bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 text-sm text-purple-800 dark:text-purple-200 italic shadow-sm font-semibold">
          "{details.description}"
        </div>
      )}

      {amenities && amenities.length > 0 && (
        <div className="pt-3 mt-3 border-t border-purple-100 dark:border-purple-800">
          <p className="text-xs text-purple-500 dark:text-purple-400 mb-2">
            Amenities
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {amenities.map((amenity, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 transition-colors hover:bg-purple-100 dark:hover:bg-purple-800/40"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
