import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PriorityLevel } from "./types/complaint";

interface PrioritySelectorProps {
  selectedPriority: string;
  onChange: (value: string) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selectedPriority,
  onChange,
}) => {
  const priorityLevels: PriorityLevel[] = [
    { value: "low", label: "Low Priority", color: "bg-blue-100 text-blue-800" },
    {
      value: "medium",
      label: "Medium Priority",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "high",
      label: "High Priority",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center dark:text-gray-200">
        Priority Level <span className="text-red-500 ml-1">*</span>
      </label>
      <Select value={selectedPriority} onValueChange={onChange}>
        <SelectTrigger className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white">
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          {priorityLevels.map((level) => (
            <SelectItem
              key={level.value}
              value={level.value}
              className="dark:text-gray-200"
            >
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    level.value === "low"
                      ? "bg-blue-500"
                      : level.value === "medium"
                      ? "bg-yellow-500"
                      : level.value === "high"
                      ? "bg-orange-500"
                      : "bg-red-500"
                  } mr-2`}
                ></span>
                {level.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PrioritySelector;
