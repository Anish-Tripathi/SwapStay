import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Info, Building, Clock, AlertCircle, HelpCircle } from "lucide-react";
import { ComplaintType } from "./types/complaint";

interface ComplaintTypeSelectorProps {
  selectedType: string;
  onChange: (value: string) => void;
}

const ComplaintTypeSelector: React.FC<ComplaintTypeSelectorProps> = ({
  selectedType,
  onChange,
}) => {
  const complaintTypes: ComplaintType[] = [
    {
      value: "technical",
      label: "Technical Issue",
      icon: <Info className="w-4 h-4 mr-2" />,
    },
    {
      value: "room-condition",
      label: "Room Condition",
      icon: <Building className="w-4 h-4 mr-2" />,
    },
    {
      value: "swap-issue",
      label: "Swap Process Issue",
      icon: <Clock className="w-4 h-4 mr-2" />,
    },
    {
      value: "user-behavior",
      label: "User Behavior",
      icon: <AlertCircle className="w-4 h-4 mr-2" />,
    },
    {
      value: "maintenance",
      label: "Maintenance Request",
      icon: <HelpCircle className="w-4 h-4 mr-2" />,
    },
    {
      value: "other",
      label: "Other",
      icon: <HelpCircle className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center dark:text-gray-200">
        Complaint Type <span className="text-red-500 ml-1">*</span>
      </label>
      <Select value={selectedType} onValueChange={onChange}>
        <SelectTrigger className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white">
          {selectedType ? (
            <div className="flex items-center gap-2">
              {complaintTypes.find((type) => type.value === selectedType)?.icon}
              <span>
                {
                  complaintTypes.find((type) => type.value === selectedType)
                    ?.label
                }
              </span>
            </div>
          ) : (
            <SelectValue placeholder="Select complaint type" />
          )}
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          {complaintTypes.map((type) => (
            <SelectItem
              key={type.value}
              value={type.value}
              className="flex items-center gap-2 dark:text-gray-200"
            >
              <div className="flex items-center gap-2">
                {type.icon}
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ComplaintTypeSelector;
