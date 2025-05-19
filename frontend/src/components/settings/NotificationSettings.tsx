import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, BellOff, Clock, Mail, MessageSquare, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NotificationSettings = ({
  notificationSettings,
  setNotificationSettings,
  updateNotificationSettings,
  toast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localNotificationData, setLocalNotificationData] = useState({
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

  useEffect(() => {
    if (notificationSettings) {
      setLocalNotificationData({
        emailNotifications: notificationSettings.emailNotifications ?? true,
        pushNotifications: notificationSettings.pushNotifications ?? false,
        swapRequests: notificationSettings.swapRequests ?? true,
        messages: notificationSettings.messages ?? true,
        announcements: notificationSettings.announcements ?? true,
        reminders: notificationSettings.reminders ?? true,
        quietHours: notificationSettings.quietHours ?? false,
        quietHoursStart: notificationSettings.quietHoursStart ?? "22:00",
        quietHoursEnd: notificationSettings.quietHoursEnd ?? "07:00",
        systemMessages: notificationSettings.systemMessages ?? true,
        marketingMessages: notificationSettings.marketingMessages ?? false,
      });
    }
  }, [notificationSettings]);

  const handleSwitchChange = (key, value) => {
    setLocalNotificationData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSelectChange = (key, value) => {
    setLocalNotificationData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await updateNotificationSettings(localNotificationData);

      setNotificationSettings(localNotificationData);

      toast({
        title: "Success",
        description: "Notification settings updated successfully!",
        duration: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error saving notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold dark:text-white">
            Notification Settings
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage how and when you receive notifications
          </CardDescription>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() =>
            isEditing ? handleSaveNotifications() : setIsEditing(true)
          }
          disabled={isLoading}
        >
          {isLoading ? (
            "Loading..."
          ) : isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium dark:text-white">
              General Notification Settings
            </h3>
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Label
                  htmlFor="emailNotifications"
                  className="dark:text-gray-300"
                >
                  Email Notifications
                </Label>
              </div>
              <Switch
                id="emailNotifications"
                checked={localNotificationData.emailNotifications || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("emailNotifications", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Label
                  htmlFor="pushNotifications"
                  className="dark:text-gray-300"
                >
                  Push Notifications
                </Label>
              </div>
              <Switch
                id="pushNotifications"
                checked={localNotificationData.pushNotifications || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("pushNotifications", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium dark:text-white">
              Notification Types
            </h3>
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="swapRequests" className="dark:text-gray-300">
                Room Swap Requests
              </Label>
              <Switch
                id="swapRequests"
                checked={localNotificationData.swapRequests || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("swapRequests", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="messages" className="dark:text-gray-300">
                New Messages
              </Label>
              <Switch
                id="messages"
                checked={localNotificationData.messages || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("messages", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="systemMessages" className="dark:text-gray-300">
                System Messages
              </Label>
              <Switch
                id="systemMessages"
                checked={localNotificationData.systemMessages || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("systemMessages", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="announcements" className="dark:text-gray-300">
                Announcements
              </Label>
              <Switch
                id="announcements"
                checked={localNotificationData.announcements || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("announcements", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminders" className="dark:text-gray-300">
                Reminders
              </Label>
              <Switch
                id="reminders"
                checked={localNotificationData.reminders || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("reminders", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketingMessages" className="dark:text-gray-300">
                Marketing Messages
              </Label>
              <Switch
                id="marketingMessages"
                checked={localNotificationData.marketingMessages || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("marketingMessages", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium dark:text-white">Quiet Hours</h3>
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Label htmlFor="quietHours" className="dark:text-gray-300">
                  Enable Quiet Hours
                </Label>
              </div>
              <Switch
                id="quietHours"
                checked={localNotificationData.quietHours || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange("quietHours", checked)
                }
                disabled={!isEditing || isLoading}
              />
            </div>
            {localNotificationData.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="quietHoursStart"
                    className="dark:text-gray-300"
                  >
                    Start Time
                  </Label>
                  <Select
                    value={localNotificationData.quietHoursStart || "22:00"}
                    onValueChange={(value) =>
                      handleSelectChange("quietHoursStart", value)
                    }
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietHoursEnd" className="dark:text-gray-300">
                    End Time
                  </Label>
                  <Select
                    value={localNotificationData.quietHoursEnd || "07:00"}
                    onValueChange={(value) =>
                      handleSelectChange("quietHoursEnd", value)
                    }
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
