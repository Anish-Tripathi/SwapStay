import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium dark:text-gray-200">
        Evidence Upload (optional)
      </label>
      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-purple-300 dark:hover:border-purple-600 transition-colors dark:bg-gray-800/50">
        {file ? (
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-green-500 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-400 font-medium">
              {file.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveFile}
              className="mt-2 text-purple-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Drag and drop files here or click to browse
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Supported formats: JPG, PNG, PDF, DOC (Max 5MB)
            </p>

            {/* Hidden file input */}
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              onChange={onFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />

            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBrowseClick}
                className=" text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Browse Files
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
