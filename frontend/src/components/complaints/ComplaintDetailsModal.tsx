import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Clock,
  MessageSquare,
  Paperclip,
  User,
  File,
} from "lucide-react";

const ComplaintDetailsModal = ({ isOpen, onClose, complaint, loading }) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!complaint && !loading) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  // Helper component for rendering evidence files
  const EvidenceFiles = ({ files, complaintId }) => {
    if (!files || files.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Paperclip className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p>No evidence files were uploaded with this complaint.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center dark:text-white">
          <Paperclip className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
          Uploaded Evidence
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={`evidence-${index}`}
              className="border dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {file.type && file.type.startsWith("image/") ? (
                <a
                  href={
                    file.url ||
                    `/api/complaints/evidence/${complaintId}/${
                      file.filename || file.name
                    }`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        file.url ||
                        `/api/complaints/evidence/${complaintId}/${
                          file.filename || file.name
                        }`
                      }
                      alt={file.name || "Evidence file"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/320";
                      }}
                    />
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {file.name || file.filename || "Evidence file"}
                    </p>
                  </div>
                </a>
              ) : (
                <a
                  href={
                    file.url ||
                    `/api/complaints/evidence/${complaintId}/${
                      file.filename || file.name
                    }`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center p-4">
                      <File className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {file.name || file.filename || "File"}
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto dark:bg-gray-850 dark:border-gray-700 p-0">
        <DialogTitle className="sr-only">Complaint Dialog</DialogTitle>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-600 rounded-full"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading complaint details...
            </span>
          </div>
        ) : complaint ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl text-purple-900 dark:text-purple-100 flex items-center">
                  <span className="mr-3">
                    Complaint #{complaint.complaintId}
                  </span>
                  {getStatusBadge(complaint.status)}
                </DialogTitle>
              </div>
              <DialogDescription className="text-base font-medium text-gray-800 dark:text-gray-100 mt-1">
                {complaint.subject}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full px-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="details"
                  className="text-sm data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="evidence"
                  className="text-sm data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Evidence
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="text-sm data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  Updates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex space-x-2">
                      <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium dark:text-gray-300">
                          Type
                        </h4>
                        <p className="text-gray-800 dark:text-white">
                          {complaint.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium dark:text-gray-300">
                          Submitted on
                        </h4>
                        <p className="text-gray-800 dark:text-white">
                          {formatDate(complaint.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium dark:text-gray-300">
                          Room Number
                        </h4>
                        <p className="text-gray-800 dark:text-white">
                          {complaint.roomNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium dark:text-gray-300">
                          Priority
                        </h4>
                        <p className="text-gray-800 dark:text-white capitalize">
                          {complaint.priority}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center dark:text-white">
                      <MessageSquare className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                      Complaint Description
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.responseNotes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center dark:text-white">
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Staff Response
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                        {complaint.responseNotes}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="pt-4">
                <EvidenceFiles
                  files={complaint.evidenceFiles}
                  complaintId={complaint._id}
                />
              </TabsContent>

              <TabsContent value="updates" className="pt-4">
                {complaint.updates && complaint.updates.length > 0 ? (
                  <div className="space-y-4">
                    {complaint.updates.map((update, index) => (
                      <div
                        key={`update-${index}`}
                        className="border dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {update.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                          >
                            {formatDate(update.date)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {update.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          - {update.staffName}, {update.staffRole}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p>No updates have been posted for this complaint yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
              <Button
                className="bg-purple-800 hover:bg-purple-900 dark:bg-purple-700 dark:hover:bg-purple-800"
                onClick={onClose}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              Failed to load complaint details
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailsModal;
