import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { roomSwapAPI } from "../services/api";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/context/ThemeContext";
import RoomRender from "@/components/browseroom/RoomRender";
import RoomDetailDialog from "@/components/browseroom/RoomDetailDialog";
import SwapRequestDialog from "@/components/browseroom/SwapRequestDialog";
import ChatRedirectDialog from "@/components/browseroom/ChatRedirectDialog";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import {
  User,
  Room,
  UserRoomResponse,
  RoomsResponse,
  UserResponse,
} from "../components/browseroom/types/about";

const BrowseRooms = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState({
    blockType: "",
    blockName: "",
    floor: "",
    wing: "",
  });
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showChat, setShowChat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [floors, setFloors] = useState<string[]>([]);
  const [wings, setWings] = useState<string[]>([]);
  const [hasListing, setHasListing] = useState(false);
  const { theme } = useTheme();
  const [swapPriority, setSwapPriority] = useState("normal");
  const [pendingSwapRequests, setPendingSwapRequests] = useState<string[]>([]);
  const [swapReason, setSwapReason] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [incomingSwapRequests, setIncomingSwapRequests] = useState<string[]>(
    []
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRoom, setUserRoom] = useState<Room | null>(null);

  const navigate = useNavigate();

  // Check for user listing when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      checkUserListing();
    }
  }, [currentUser]);

  // Fetch user data on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get<UserResponse>(
          `${API_URL}/api/users/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.success && response.data.data) {
          // Get the user data
          const userData = response.data.data;

          // Wait for the user data before checking room listing
          setCurrentUser(userData);
        } else {
          console.error("No user data found in response");
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error with main endpoint:", err);
        setCurrentUser(null);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch swap requests when user data is loaded
  useEffect(() => {
    if (currentUser) {
      fetchSwapRequests();
    }
  }, [currentUser]);

  // Re-fetch rooms when activeTab changes
  useEffect(() => {
    if (currentUser) {
      fetchRooms();
    }
  }, [activeTab, currentUser]);

  // Initialize image index for each room
  useEffect(() => {
    const initialImageIndices: Record<string, number> = {};
    rooms.forEach((room) => {
      initialImageIndices[room._id] = 0;
    });
    setCurrentImageIndex(initialImageIndices);
  }, [rooms]);

  const fetchSwapRequests = async () => {
    try {
      // Only fetch if the user is authenticated
      if (currentUser) {
        // Use the roomSwapAPI service
        const swapRequestsData = await roomSwapAPI.getMySwapRequests();

        if (swapRequestsData && swapRequestsData.data) {
          // Extract outgoing requests (requests I've sent)
          if (swapRequestsData.data.sent) {
            const pendingRoomIds = swapRequestsData.data.sent
              .filter((request) => request.status === "pending")
              .map((request) => request.requestedRoom._id);

            setPendingSwapRequests(pendingRoomIds);
          }

          // Extract incoming requests (requests others have sent to me)
          if (swapRequestsData.data.received) {
            const incomingRoomIds = swapRequestsData.data.received
              .filter((request) => request.status === "pending")
              .map((request) => request.requesterRoom._id);

            setIncomingSwapRequests(incomingRoomIds);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching swap requests:", err);
    }
  };

  const checkUserListing = async () => {
    try {
      setLoading(true);

      // First check if user has listed a room
      const userRoomResponse = await axios.get<UserRoomResponse>(
        `${API_URL}/api/rooms/user-room`,
        {
          withCredentials: true,
        }
      );

      if (userRoomResponse.data && "hasListing" in userRoomResponse.data) {
        const userHasListing = Boolean(userRoomResponse.data.hasListing);
        setHasListing(userHasListing);

        // Store the user's room details if available
        if (userHasListing && userRoomResponse.data.roomDetails) {
          setUserRoom(userRoomResponse.data.roomDetails);
        }

        // Always fetch rooms regardless of whether user has a listing
        // We'll filter out their own room in the fetchRooms function
        fetchRooms();
      }
    } catch (error) {
      console.error("Error checking user listing:", error);
      setError("Could not verify your room listing status.");
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      let url = `${API_URL}/api/rooms/available`;

      // Add filter query params
      if (activeTab !== "all") {
        url += `?blockType=${activeTab}`;
      }

      const response = await axios.get<RoomsResponse>(url);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        const roomsData = response.data.data;

        // Filter out the current user's room
        const filteredRooms = roomsData.filter((room) => {
          if (!room.owner || !currentUser) return true;
          return room.owner._id !== currentUser._id;
        });

        setRooms(filteredRooms);

        if (filteredRooms.length > 0) {
          setBlocks([...new Set(filteredRooms.map((room) => room.blockName))]);
          setFloors([...new Set(filteredRooms.map((room) => room.floor))]);
          setWings([...new Set(filteredRooms.map((room) => room.wing))]);
        }

        setError(null);
      } else {
        setRooms([]);
        setError("Failed to load rooms. Invalid response format.");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms. Please try again later.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter((room) => {
    const matchesBlock =
      !filters.blockName || room.blockName === filters.blockName;
    const matchesFloor = !filters.floor || room.floor === filters.floor;
    const matchesWing = !filters.wing || room.wing === filters.wing;
    return matchesBlock && matchesFloor && matchesWing;
  });

  const handleSwapRequest = (roomId: string) => {
    // First check if user is logged in
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request a room swap.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has a room to swap
    if (!hasListing) {
      toast({
        title: "No Room Found",
        description: "You need to have a room listed before requesting a swap.",
        variant: "destructive",
      });

      // Ask if they want to list their room now
      if (window.confirm("Would you like to list your room now?")) {
        // Redirect to the list room page
        window.location.href = "/list-room";
      }
      return;
    }

    setShowConfirmation(roomId);
  };

  const confirmSwap = async () => {
    try {
      setLoading(true);

      // Validate inputs
      if (!swapReason.trim()) {
        toast({
          title: "Missing Information",
          description: "Please provide a reason for the swap request.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if this room already has a pending request
      if (showConfirmation && pendingSwapRequests.includes(showConfirmation)) {
        toast({
          title: "Request Already Sent",
          description: "You already have a pending swap request for this room.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Find the selected room for better error messaging
      const selectedRoom = rooms.find((room) => room._id === showConfirmation);

      if (showConfirmation) {
        // Use the roomSwapAPI service with priority
        await roomSwapAPI.createSwapRequest(
          showConfirmation,
          swapReason,
          swapPriority
        );

        // Add the room ID to pending swap requests
        setPendingSwapRequests((prev) => [...prev, showConfirmation]);

        // Show success message
        toast({
          title: "Swap Request Sent",
          description: `Your ${swapPriority} priority swap request for ${selectedRoom?.blockName} ${selectedRoom?.roomNumber} has been sent successfully.`,
        });

        // Reset UI state
        setShowConfirmation(null);
        setSwapReason("");
        setSwapPriority("normal"); // Reset priority to default
      }
    } catch (err: any) {
      console.error("Swap request error:", err);

      toast({
        title: "Request Failed",
        description:
          err.response?.data?.message ||
          "Failed to send swap request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (roomId: string) => {
    setShowChat(roomId);
  };

  return (
    <div>
      <Navbar />

      <div className="flex-1 py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900">
        <RoomRender
          loading={loading}
          hasListing={hasListing}
          userRoom={userRoom}
          theme={theme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          setFilters={setFilters}
          blocks={blocks}
          floors={floors}
          wings={wings}
          error={error}
          filteredRooms={filteredRooms}
          API_URL={API_URL}
          currentImageIndex={currentImageIndex}
          pendingSwapRequests={pendingSwapRequests}
          incomingSwapRequests={incomingSwapRequests}
          setSelectedRoom={setSelectedRoom}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      </div>

      {/* Room Details Dialog */}
      <RoomDetailDialog
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        theme={theme}
        API_URL={API_URL}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        handleSwapRequest={handleSwapRequest}
        handleChat={handleChat}
        pendingSwapRequests={pendingSwapRequests}
        incomingSwapRequests={incomingSwapRequests}
      />

      {/* Swap Confirmation Modal */}
      <SwapRequestDialog
        isOpen={showConfirmation !== null}
        onClose={() => {
          // Ensure state updates are batched properly
          setShowConfirmation(null);
          setSwapPriority("normal");
          setSwapReason(""); // Reset swap reason when closing
        }}
        onConfirm={() => {
          confirmSwap();
          // Don't close the dialog here - let the loading state handle it
        }}
        roomDetails={
          showConfirmation !== null
            ? rooms.find((room) => room._id === showConfirmation) || null
            : null
        }
        swapReason={swapReason}
        setSwapReason={setSwapReason}
        isLoading={loading}
        priority={swapPriority}
        setPriority={setSwapPriority}
      />

      {/* Chat Redirect Dialog */}
      <ChatRedirectDialog
        showChat={showChat}
        setShowChat={setShowChat}
        theme={theme}
        navigate={navigate}
      />

      <Footer />
    </div>
  );
};

export default BrowseRooms;
