import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building } from "lucide-react";

const RoomSettings = ({
  roomData,
  setRoomData,
  isLoadingRoom,
  setIsLoadingRoom,
  updateRoom,
  toast,
}) => {
  const [isEditingRoom, setIsEditingRoom] = useState(false);

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveRoom = async () => {
    setIsLoadingRoom(true);
    try {
      await updateRoom({
        blockType: roomData.blockType,
        blockName: roomData.blockName,
        floor: roomData.floor,
        roomNumber: roomData.roomNumber,
        wing: roomData.wing,
        sharing: roomData.sharing,
        availableForSwap: roomData.availableForSwap,
      });
      toast({
        title: "Success",
        description: "Room details updated successfully!",
        duration: 3000,
      });
      setIsEditingRoom(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room details. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error saving room details:", error);
    } finally {
      setIsLoadingRoom(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold dark:text-white">
            Room Settings
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage your room details
          </CardDescription>
        </div>
        <Button
          variant={isEditingRoom ? "default" : "outline"}
          size="sm"
          onClick={() =>
            isEditingRoom ? handleSaveRoom() : setIsEditingRoom(true)
          }
          disabled={isLoadingRoom}
        >
          {isLoadingRoom ? (
            "Loading..."
          ) : isEditingRoom ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-medium dark:text-white">
            Room Information
          </h3>
        </div>
        <Separator className="dark:bg-gray-700" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blockType" className="dark:text-gray-300">
              Block Type
            </Label>
            <Input
              id="blockType"
              name="blockType"
              value={roomData.blockType || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockName" className="dark:text-gray-300">
              Block Name
            </Label>
            <Input
              id="blockName"
              name="blockName"
              value={roomData.blockName || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor" className="dark:text-gray-300">
              Floor
            </Label>
            <Input
              id="floor"
              name="floor"
              value={roomData.floor || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="dark:text-gray-300">
              Room Number
            </Label>
            <Input
              id="roomNumber"
              name="roomNumber"
              value={roomData.roomNumber || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wing" className="dark:text-gray-300">
              Wing
            </Label>
            <Input
              id="wing"
              name="wing"
              value={roomData.wing || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharing" className="dark:text-gray-300">
              Sharing
            </Label>
            <Input
              id="sharing"
              name="sharing"
              value={roomData.sharing || ""}
              onChange={handleRoomChange}
              disabled={!isEditingRoom || isLoadingRoom}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="pt-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="availableForSwap"
              name="availableForSwap"
              checked={roomData.availableForSwap || false}
              onChange={(e) =>
                setRoomData((prevData) => ({
                  ...prevData,
                  availableForSwap: e.target.checked,
                }))
              }
              disabled={!isEditingRoom || isLoadingRoom}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <Label htmlFor="availableForSwap" className="dark:text-gray-300">
              Available for Swap
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomSettings;
