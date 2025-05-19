import { useState, useEffect } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ProfileSettings from "@/components/settings/ProfileSettings";
import RoomSettings from "@/components/settings/RoomSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // User profile state
  const [profileData, setProfileData] = useState({
    name: "",
    rollNo: "",
    department: "",
    phoneNumber: "",
    year: "",
    degree: "",
    gender: "",
    email: "",
    profilePicture: "/avatar-placeholder.jpg",
  });

  // Room data state
  const [roomData, setRoomData] = useState({
    blockType: "",
    blockName: "",
    floor: "",
    roomNumber: "",
    wing: "",
    sharing: "",
    availableForSwap: false,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    swapRequests: true,
    messages: true,
    announcements: true,
    reminders: true,
    quietHours: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    systemMessages: true,
    marketingMessages: false,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    fetchUserData();
    fetchRoomData();
  }, []);

  // Fetch user profile data
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserProfile();

      // Update state with fetched data
      setProfileData({
        name: userData.name || "",
        rollNo: userData.rollNo || "",
        department: userData.department || "",
        phoneNumber: userData.phone || "",
        year: userData.year || "",
        degree: userData.degree || "",
        gender: userData.gender || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "/avatar-placeholder.png",
      });

      // Set notification settings if available
      if (userData.notificationSettings) {
        setNotificationSettings(userData.notificationSettings);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user profile");
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  // Fetch room data
  const fetchRoomData = async () => {
    setIsLoadingRoom(true);
    try {
      const roomData = await fetchUserRoom();

      // Update state with fetched data
      setRoomData({
        blockType: roomData.blockType || "",
        blockName: roomData.blockName || "",
        floor: roomData.floor || "",
        roomNumber: roomData.roomNumber || "",
        wing: roomData.wing || "",
        sharing: roomData.sharing || "",
        availableForSwap: roomData.availableForSwap || false,
      });
    } catch (error) {
      console.error("Error fetching room data:", error);

      // Set default empty values
      setRoomData({
        blockType: "",
        blockName: "",
        floor: "",
        roomNumber: "",
        wing: "",
        sharing: "",
        availableForSwap: false,
      });

      toast({
        title: "No Room Found",
        description:
          "No room information available. You can add your room details here.",
        variant: "default",
        duration: 5000,
      });
    } finally {
      setIsLoadingRoom(false);
    }
  };

  // Fetch user room
  const fetchUserRoom = async () => {
    try {
      const response = await fetch("/api/users/room", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Room not found");
        } else {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error("Failed to fetch room data");
        }
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching room data:", error);
      throw error;
    }
  };

  // Update profile data
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Update room data
  const updateRoom = async (roomData) => {
    try {
      const response = await fetch("/api/users/room", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(roomData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update room details");
      }

      return data;
    } catch (error) {
      console.error("Error updating room details:", error);
      throw error;
    }
  };

  // Update theme preference
  const updateTheme = async (theme) => {
    try {
      const response = await fetch("/api/users/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update theme");
      }

      return data;
    } catch (error) {
      console.error("Error updating theme:", error);
      throw error;
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (settings) => {
    try {
      const response = await fetch("/api/users/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notificationSettings: settings }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update notification settings");
      }

      return data;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/profile/picture", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `HTTP error ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Server error: ${errorText.substring(0, 100)}...`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 bg-purple-200 dark:bg-gradient-to-r dark:from-gray-900 dark:to-purple-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SettingsSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profileData={profileData}
            />

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <ProfileSettings
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  updateProfile={updateProfile}
                  uploadProfilePicture={uploadProfilePicture}
                  toast={toast}
                />
              )}

              {activeTab === "room" && (
                <RoomSettings
                  roomData={roomData}
                  setRoomData={setRoomData}
                  isLoadingRoom={isLoadingRoom}
                  setIsLoadingRoom={setIsLoadingRoom}
                  updateRoom={updateRoom}
                  toast={toast}
                />
              )}

              {activeTab === "appearance" && (
                <AppearanceSettings updateTheme={updateTheme} toast={toast} />
              )}

              {activeTab === "notifications" && (
                <NotificationSettings
                  notificationSettings={notificationSettings}
                  setNotificationSettings={setNotificationSettings}
                  updateNotificationSettings={updateNotificationSettings}
                  toast={toast}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
