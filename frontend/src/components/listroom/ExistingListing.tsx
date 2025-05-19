import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ChevronDown,
  Users,
  Trash2,
  Home,
  Hash,
  Layers,
  User,
  List,
} from "lucide-react";

interface ExistingListingProps {
  existingRoom: any;
  isDeleting: boolean;
  onToggleDialogOpen: () => void;
  onDeleteDialogOpen: () => void;
}

const ExistingListing = ({
  existingRoom,
  isDeleting,
  onToggleDialogOpen,
  onDeleteDialogOpen,
}: ExistingListingProps) => {
  const getAmenityLabel = (code: string) => {
    const amenityMap: Record<string, string> = {
      "0": "WiFi",
      "1": "AC",
      "2": "Attached Bathroom",
      "3": "Balcony",
      "4": "Study Table",
      "5": "Wardrobe",
      "6": "Hot Water",
      "7": "Refrigerator",
      "8": "TV",
    };
    return amenityMap[code] || code;
  };

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4 text-center bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-800 text-white rounded-t-lg">
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Home className="h-8 w-8" />
          You have already listed your room
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-amber-50 dark:bg-amber-900/50 border-l-4 border-amber-400 dark:border-amber-500 p-4 mb-6 rounded">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                <strong className="text-amber-700 dark:text-amber-200">
                  Listing Rules (Click to Expand)
                </strong>
              </div>
              <ChevronDown className="h-4 w-4 text-amber-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 pl-7 space-y-2 text-amber-700 dark:text-amber-200">
              <ul className="list-disc space-y-1">
                <li>
                  After listing, you can change the room's availability status.
                </li>
                <li>
                  Update room details (Block, floor, wing, room no and sharing)
                  in <strong>Room Settings</strong>.
                </li>
                <li>
                  To update the listing itself, delete the current one and
                  create a new room.
                </li>
              </ul>
              <p className="font-semibold">
                <span className="text-red-500">Note:</span> Unlisted rooms can't
                be modified.
              </p>
            </div>
          </details>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            Your Current Listing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Block
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {existingRoom?.blockName || "N/A"} ({existingRoom?.blockType})
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Room Number
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {existingRoom?.roomNumber || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Floor & Wing
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Floor {existingRoom?.floor || "N/A"},{" "}
                  {existingRoom?.wing || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sharing
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {existingRoom?.sharing === "1"
                    ? "Single Sharing"
                    : existingRoom?.sharing === "2"
                    ? "Double Sharing"
                    : existingRoom?.sharing === "3"
                    ? "Triple Sharing"
                    : existingRoom?.sharing === "4"
                    ? "Four Sharing"
                    : existingRoom?.sharing}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Description
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {existingRoom?.description || "No description provided."}
            </p>
          </div>

          {existingRoom?.amenities && existingRoom.amenities.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {existingRoom.amenities.map((amenityCode, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded text-xs"
                  >
                    {getAmenityLabel(amenityCode)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                existingRoom?.availableForSwap ? "bg-green-500" : "bg-amber-500"
              }`}
            ></div>
            <p
              className={`text-sm ${
                existingRoom?.availableForSwap
                  ? "text-green-600 dark:text-green-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {existingRoom?.availableForSwap
                ? "Available for swap"
                : "Not available for swap"}
            </p>
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <Button
              onClick={onToggleDialogOpen} // Now triggers the dialog instead of direct action
              disabled={isDeleting}
              className={`flex items-center gap-2 ${
                existingRoom?.availableForSwap
                  ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              } text-white`}
            >
              {existingRoom?.availableForSwap ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  {isDeleting ? "Updating..." : "Make Unavailable"}
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  {isDeleting ? "Updating..." : "Make Available"}
                </>
              )}
            </Button>
            <Button
              onClick={onDeleteDialogOpen}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete This Listing"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingListing;
