import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeftRight } from "lucide-react";
import { RoomDetailDialogProps, getAmenityLabel } from "./types/about";
import { RoomDetails } from "../browseroom/RoomDetails";

const RoomDetailDialog: React.FC<RoomDetailDialogProps> = ({
  selectedRoom,
  setSelectedRoom,
  theme,
  API_URL,
  currentImageIndex,
  setCurrentImageIndex,
  handleSwapRequest,
  handleChat,
  pendingSwapRequests,
  incomingSwapRequests,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClose = () => {
    setSelectedRoom(null);
  };

  if (!selectedRoom) return null;

  const isPending = pendingSwapRequests.includes(selectedRoom._id);
  const isIncoming = incomingSwapRequests.includes(selectedRoom._id);

  const prevImage = () => {
    if (
      !selectedRoom ||
      !selectedRoom.images ||
      selectedRoom.images.length === 0
    )
      return;

    if (setCurrentImageIndex) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [selectedRoom._id]:
          (prev[selectedRoom._id] - 1 + selectedRoom.images.length) %
          selectedRoom.images.length,
      }));
    }

    setActiveIndex(
      (activeIndex - 1 + selectedRoom.images.length) %
        selectedRoom.images.length
    );
  };

  const nextImage = () => {
    if (
      !selectedRoom ||
      !selectedRoom.images ||
      selectedRoom.images.length === 0
    )
      return;

    if (setCurrentImageIndex) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [selectedRoom._id]:
          (prev[selectedRoom._id] + 1) % selectedRoom.images.length,
      }));
    }

    setActiveIndex((activeIndex + 1) % selectedRoom.images.length);
  };

  return (
    <Dialog
      open={!!selectedRoom}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className={`sm:max-w-[600px] max-h-[90vh] overflow-y-auto ${
          theme === "dark"
            ? "bg-gradient-to-b from-purple-900 to-slate-900 text-white border-slate-700"
            : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-2xl text-center ${
              theme === "dark" ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Room Details
          </DialogTitle>
          <DialogDescription
            className={`text-center ${theme === "dark" ? "text-gray-400" : ""}`}
          >
            View detailed information about this room
          </DialogDescription>
        </DialogHeader>

        {selectedRoom && (
          <RoomDetails
            selectedRoom={selectedRoom}
            theme={theme}
            currentImageIndex={currentImageIndex}
            activeIndex={activeIndex}
            prevImage={prevImage}
            nextImage={nextImage}
            API_URL={API_URL}
            getAmenityLabel={getAmenityLabel}
          />
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handleClose()}
            className={`sm:flex-1 ${
              theme === "dark"
                ? "border-gray-600 text-purple-800 hover:bg-slate-700 hover:text-white"
                : ""
            }`}
          >
            Close
          </Button>
          <Button
            onClick={() => handleChat(selectedRoom?._id)}
            className="bg-purple-600 hover:bg-purple-700 sm:flex-1"
          >
            <MessageCircle size={16} className="mr-2" />
            Chat with Occupant
          </Button>
          {isPending ? (
            <Button
              disabled
              className="bg-gray-400 cursor-not-allowed sm:flex-1"
            >
              Swap Request Pending
            </Button>
          ) : isIncoming ? (
            <Button
              disabled
              className="bg-red-400 cursor-not-allowed sm:flex-1"
            >
              Swap Request Received
            </Button>
          ) : (
            <Button
              onClick={() => handleSwapRequest(selectedRoom?._id)}
              className="bg-purple-600 hover:bg-purple-700 sm:flex-1"
            >
              <ArrowLeftRight size={16} className="mr-2" />
              Request Swap
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailDialog;
