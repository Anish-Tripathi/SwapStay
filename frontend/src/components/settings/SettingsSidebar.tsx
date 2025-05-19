import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Sun, Bell, ChevronRight, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsSidebar = ({ activeTab, setActiveTab, profileData }) => {
  return (
    <div className="w-full md:w-64 shrink-0">
      <Card className="sticky top-20 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  profileData.profilePicture.startsWith("http")
                    ? profileData.profilePicture
                    : `http://localhost:5000${profileData.profilePicture}`
                }
                alt={profileData.name}
              />
              <AvatarFallback className="bg-purple-700 text-white text-2xl">
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center dark:text-white">
              {profileData.name}
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-400 uppercase">
              {profileData.department}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-4 text-left rounded-none border-l-2 ${
                activeTab === "profile"
                  ? "border-l-purple-700 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                  : "border-l-transparent dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
              <ChevronRight className="ml-auto h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-4 text-left rounded-none border-l-2 ${
                activeTab === "room"
                  ? "border-l-purple-700 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                  : "border-l-transparent dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("room")}
            >
              <Home className="mr-2 h-5 w-5" />
              Room Settings
              <ChevronRight className="ml-auto h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-4 text-left rounded-none border-l-2 ${
                activeTab === "appearance"
                  ? "border-l-purple-700 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                  : "border-l-transparent dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("appearance")}
            >
              <Sun className="mr-2 h-5 w-5" />
              Appearance
              <ChevronRight className="ml-auto h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-4 text-left rounded-none border-l-2 ${
                activeTab === "notifications"
                  ? "border-l-purple-700 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                  : "border-l-transparent dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              <ChevronRight className="ml-auto h-5 w-5" />
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSidebar;
