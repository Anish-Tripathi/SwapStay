import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Complaint } from "./types/complaint";

interface ComplaintsListProps {
  complaints: Complaint[];
  viewComplaintDetails: (id: string) => void;
  isLoading: boolean;
}

const ComplaintCard: React.FC<{
  complaint: Complaint;
  onClick: () => void;
}> = ({ complaint, onClick }) => {
  // Map status to appropriate color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {complaint.subject}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {complaint.description?.substring(0, 100)}
            {complaint.description && complaint.description.length > 100
              ? "..."
              : ""}
          </p>
        </div>
        <div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
              complaint.status
            )}`}
          >
            {complaint.status}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>{complaint.type}</span>
          <span>•</span>
          <span>Room {complaint.roomNumber}</span>
        </div>
        <div>{formatDate(complaint.date)}</div>
      </div>
    </div>
  );
};

const ComplaintsList: React.FC<ComplaintsListProps> = ({
  complaints,
  viewComplaintDetails,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusOptions = ["Pending", "In-Progress", "Resolved", "Closed"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredComplaints = complaints
    .filter((complaint) => {
      // Apply search filter
      if (
        searchTerm &&
        !complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(
          complaint.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ?? false
        )
      ) {
        return false;
      }

      // Apply status filter
      if (
        statusFilter &&
        complaint.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sort order
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search complaints..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative" ref={statusDropdownRef}>
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:border-gray-700 dark:text-purple-800"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>{statusFilter || "Status"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Status dropdown */}
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div
                    className="px-4 py-2 text-sm text-gray-700 dark:text-purple-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      setStatusFilter(null);
                      setStatusDropdownOpen(false);
                    }}
                  >
                    <span>All Status</span>
                    {statusFilter === null && <Check className="h-4 w-4" />}
                  </div>
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setStatusFilter(status);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <span>{status}</span>
                      {statusFilter === status && <Check className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:border-gray-700 dark:text-purple-800"
              onClick={() =>
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
              }
            >
              <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Show active filters */}
      {(searchTerm || statusFilter) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Active filters:</span>
            {statusFilter && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                Status: {statusFilter}
              </span>
            )}
            {searchTerm && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear filters
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id || complaint._id}
              complaint={complaint}
              onClick={() =>
                viewComplaintDetails(complaint.id || complaint._id || "")
              }
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter
                ? "No complaints match your search criteria"
                : "You haven't submitted any complaints yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;
