import React from "react";
import { Clock, MessageCircle, Paperclip, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ComplaintCardProps } from "./types/complaint";

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const statusStyles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    resolved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {complaint.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {complaint.id}
            </p>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusStyles[complaint.status]
            }`}
          >
            {complaint.status.charAt(0).toUpperCase() +
              complaint.status.slice(1).replace("-", " ")}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {complaint.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(complaint.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {complaint.hasAttachments && (
            <div className="flex items-center">
              <Paperclip className="mr-1.5 h-4 w-4" />
              <span>Attachments</span>
            </div>
          )}

          {complaint.commentCount && complaint.commentCount > 0 && (
            <div className="flex items-center">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              <span>{complaint.commentCount} comments</span>
            </div>
          )}

          <div className="ml-auto flex items-center text-purple-600 dark:text-purple-400 font-medium">
            <span>View details</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
