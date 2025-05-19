import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomFormDetailsProps } from "./types/listroom";

const RoomFormDetails = ({
  blockType,
  setBlockType,
  blockName,
  setBlockName,
  floor,
  setFloor,
  wing,
  setWing,
  roomNumber,
  setRoomNumber,
  sharing,
  setSharing,
  goToStep,
}: RoomFormDetailsProps) => {
  return (
    <div className="space-y-6 mt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="blockType"
            className="text-base text-gray-800 dark:text-gray-200"
          >
            Hostel Block Type
          </Label>
          <Select value={blockType} onValueChange={setBlockType}>
            <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select block type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectItem value="boys">Boys Hostel</SelectItem>
              <SelectItem value="girls">Girls Hostel</SelectItem>
              <SelectItem value="mt">MT Blocks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="blockName"
            className="text-base text-gray-800 dark:text-gray-200"
          >
            Block Name
          </Label>
          <Input
            id="blockName"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            placeholder="e.g. Himalaya (MT1)"
            className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="floor"
            className="text-base text-gray-800 dark:text-gray-200"
          >
            Floor
          </Label>
          <Input
            id="floor"
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="Floor number"
            className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="wing"
            className="text-base text-gray-800 dark:text-gray-200"
          >
            Wing
          </Label>
          <Input
            id="wing"
            value={wing}
            onChange={(e) => setWing(e.target.value)}
            placeholder="e.g. East Wing"
            className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="roomNumber"
          className="text-base text-gray-800 dark:text-gray-200"
        >
          Room Number
        </Label>
        <Input
          id="roomNumber"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="e.g. 203"
          className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="sharing"
          className="text-base text-gray-800 dark:text-gray-200"
        >
          Number of Sharing
        </Label>
        <Select value={sharing} onValueChange={setSharing}>
          <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select sharing type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <SelectItem value="1">Single Sharing</SelectItem>
            <SelectItem value="2">Double Sharing</SelectItem>
            <SelectItem value="3">Triple Sharing</SelectItem>
            <SelectItem value="4">Four Sharing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => goToStep("images")}
          className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
        >
          Next: Add Images
        </Button>
      </div>
    </div>
  );
};

export default RoomFormDetails;
