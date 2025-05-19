import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  complaintId: string;
  resetForm: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  complaintId,
  resetForm,
  setActiveTab,
}) => {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-green-100 dark:border-green-900 space-y-4 text-center">
      <div className="flex items-center justify-center">
        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Complaint Submitted
      </h2>

      <p className="text-gray-600 dark:text-gray-300">
        Your complaint has been successfully submitted. We will review and
        respond as soon as possible.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 my-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Complaint Reference
        </p>
        <p className="text-lg font-mono mt-1 text-gray-900 dark:text-gray-100">
          {complaintId}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Please save this reference number for future inquiries
        </p>
      </div>

      <div className="space-y-2">
        <Button onClick={resetForm} className="w-full">
          Submit Another Complaint
        </Button>
        <Button
          variant="outline"
          className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => setActiveTab("my-complaints")}
        >
          View My Complaints
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
