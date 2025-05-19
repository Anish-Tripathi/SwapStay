import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { ComplaintFormState } from "./types/complaint";
import ComplaintTypeSelector from "./ComplaintTypeSelector";
import PrioritySelector from "./PrioritySelector";
import FileUpload from "./FileUpload";

interface ComplaintFormProps {
  formState: ComplaintFormState;
  handleInputChange: (field: string, value: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  formState,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  resetForm,
}) => {
  return (
    <Card className="border-purple-100 dark:border-purple-800 shadow-sm">
      <CardHeader className="border-b bg-purple-50 dark:bg-purple-900">
        <CardTitle className="flex items-center text-xl text-purple-900 dark:text-purple-100">
          <AlertCircle className="w-5 h-5 mr-2 text-purple-700 dark:text-purple-400" />
          Complaint Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complaint Type Selector */}
          <ComplaintTypeSelector
            selectedType={formState.type}
            onChange={(value) => handleInputChange("type", value)}
          />

          {/* Priority Level Selector */}
          <PrioritySelector
            selectedPriority={formState.priority}
            onChange={(value) => handleInputChange("priority", value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center dark:text-gray-200">
              Your Email <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white"
              value={formState.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center dark:text-gray-200">
              Room Number <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              placeholder="Enter your room number (e.g., B-101)"
              className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white"
              value={formState.roomNumber}
              onChange={(e) => handleInputChange("roomNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center dark:text-gray-200">
            Subject <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            placeholder="Brief subject of your complaint"
            className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white"
            value={formState.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center dark:text-gray-200">
            Complaint Description <span className="text-red-500 ml-1">*</span>
          </label>
          <Textarea
            placeholder="Please describe your complaint in detail. Include specific information about the issue, when it occurred, and any steps you've already taken to resolve it."
            className="min-h-[180px] border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800 dark:text-white"
            value={formState.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        {/* File Upload Component */}
        <FileUpload
          file={formState.file}
          onFileChange={handleFileChange}
          onRemoveFile={() => handleInputChange("file", null)}
        />
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-end pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 self-start sm:self-center">
          <span className="text-red-500">*</span> Required fields
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-initial dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={resetForm}
          >
            Clear Form
          </Button>
          <Button
            className="flex-1 sm:flex-initial bg-purple-800 hover:bg-purple-900 dark:bg-purple-700 dark:hover:bg-purple-800"
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <span className="animate-spin mr-2">
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Complaint
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComplaintForm;
