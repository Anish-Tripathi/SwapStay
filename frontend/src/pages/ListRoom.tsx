import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { useTheme } from "@/components/context/ThemeContext";

import RoomForm from "@/components/listroom/RoomForm";
import ExistingListing from "@/components/listroom/ExistingListing";
import ListingTips from "@/components/listroom/ListingTips";
import LoadingState from "@/components/listroom/LoadingState";
import { ToggleAvailabilityDialog } from "@/components/listroom/ToggleAvailabilityDialog";
import { DeleteListingDialog } from "@/components/listroom/DeleteListingDialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ListRoom = () => {
  const [loading, setLoading] = useState(true);
  const [hasExistingListing, setHasExistingListing] = useState(false);
  const [existingRoom, setExistingRoom] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const checkExistingListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/rooms/user-room`, {
          withCredentials: true,
        });

        // Type checking before accessing properties
        if (response.data && typeof response.data === "object") {
          if ("hasListing" in response.data) {
            setHasExistingListing(Boolean(response.data.hasListing));

            // Check if both hasListing is true and roomDetails exists
            if (response.data.hasListing && "roomDetails" in response.data) {
              setExistingRoom(response.data.roomDetails);
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing listing:", error);
        toast({
          title: "Error",
          description: "Could not check for existing room listings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkExistingListing();
  }, []);

  const handleSubmitRoom = async (formData) => {
    try {
      setIsSubmitting(true);

      await axios.post(`${API_URL}/api/rooms`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast({
        title: "Room Listed Successfully",
        description: "Your room has been listed and is now available for swap.",
      });

      // Refresh the page or update state to show the new listing
      window.location.reload();
    } catch (error) {
      console.error("Error submitting room:", error);
      toast({
        title: "Error",
        description: "Failed to list your room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!existingRoom) return;

    try {
      setIsDeleting(true);
      await axios.delete(`${API_URL}/api/rooms/${existingRoom._id}`, {
        withCredentials: true,
      });

      setHasExistingListing(false);
      setExistingRoom(null);

      toast({
        title: "Room Deleted",
        description: "Your room listing has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room listing.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!existingRoom) return;

    try {
      setIsDeleting(true);

      await axios.patch(
        `${API_URL}/api/rooms/${existingRoom._id}/toggle-availability`,
        { availableForSwap: !existingRoom.availableForSwap },
        { withCredentials: true }
      );

      setExistingRoom({
        ...existingRoom,
        availableForSwap: !existingRoom.availableForSwap,
      });

      toast({
        title: "Room Status Updated",
        description: existingRoom.availableForSwap
          ? "Your room is now marked as unavailable for swap."
          : "Your room is now marked as available for swap.",
      });
    } catch (error) {
      console.error("Error updating room availability:", error);
      toast({
        title: "Error",
        description: "Failed to update room availability.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowToggleDialog(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}
    >
      <Navbar />

      <div className="flex-1 py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState />
          ) : hasExistingListing ? (
            <ExistingListing
              existingRoom={existingRoom}
              isDeleting={isDeleting}
              onDeleteDialogOpen={() => setShowDeleteDialog(true)}
              onToggleDialogOpen={() => setShowToggleDialog(true)}
            />
          ) : (
            <RoomForm
              API_URL={API_URL}
              onSubmit={handleSubmitRoom}
              isLoading={isSubmitting}
            />
          )}
          <ListingTips />
        </div>
      </div>
      <ToggleAvailabilityDialog
        open={showToggleDialog}
        onOpenChange={setShowToggleDialog}
        isAvailable={existingRoom?.availableForSwap || false}
        isUpdating={isDeleting}
        onConfirm={handleToggleAvailability}
      />
      <DeleteListingDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        isDeleting={isDeleting}
        onConfirm={handleDeleteListing}
      />

      <Footer />
    </div>
  );
};

export default ListRoom;
