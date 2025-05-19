import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface RoomFiltersProps {
  onFilterChange: (filters: {
    blockName: string;
    floor: string;
    wing: string;
  }) => void;
  blocks?: string[];
  floors?: string[];
  wings?: string[];
  activeTab?: string;
}

export default function RoomFilters({
  onFilterChange,
  blocks = [],
  floors = [],
  wings = [],
  activeTab = "all",
}: RoomFiltersProps) {
  const [blockName, setBlockName] = useState("");
  const [floor, setFloor] = useState("");
  const [wing, setWing] = useState("");

  // Reset filters when tabs change
  useEffect(() => {
    setBlockName("");
    setFloor("");
    setWing("");
  }, [activeTab]);

  const handleFilterChange = (
    type: "blockName" | "floor" | "wing",
    value: string
  ) => {
    const normalizedValue = value === "all" ? "" : value;

    let newBlockName = blockName;
    let newFloor = floor;
    let newWing = wing;

    switch (type) {
      case "blockName":
        newBlockName = normalizedValue;
        setBlockName(value);
        break;
      case "floor":
        newFloor = normalizedValue;
        setFloor(value);
        break;
      case "wing":
        newWing = normalizedValue;
        setWing(value);
        break;
    }

    // Pass normalized values to parent component
    onFilterChange({
      blockName: newBlockName,
      floor: newFloor,
      wing: newWing,
    });
  };

  const resetFilters = () => {
    setBlockName("");
    setFloor("");
    setWing("");
    onFilterChange({
      blockName: "",
      floor: "",
      wing: "",
    });
  };

  const filtersActive = blockName || floor || wing;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
      <Select
        value={blockName}
        onValueChange={(value) => handleFilterChange("blockName", value)}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Select Block" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {blocks &&
            blocks.map((block) => (
              <SelectItem key={block} value={block}>
                {block}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={floor}
        onValueChange={(value) => handleFilterChange("floor", value)}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Select Floor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Floors</SelectItem>
          {floors &&
            floors.map((floorItem) => (
              <SelectItem key={floorItem} value={floorItem}>
                {floorItem}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={wing}
        onValueChange={(value) => handleFilterChange("wing", value)}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Select Wing" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Wings</SelectItem>
          {wings &&
            wings.map((wingItem) => (
              <SelectItem key={wingItem} value={wingItem}>
                {wingItem}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {filtersActive && (
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-purple-600 hover:text-purple-800 flex gap-2 items-center"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
