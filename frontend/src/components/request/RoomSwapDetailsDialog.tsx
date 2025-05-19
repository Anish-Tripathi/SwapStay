import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  CheckCircle,
  XCircle,
  CheckSquare,
  XSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { roomSwapAPI } from "@/services/api";
import { RoomDetailsSection } from "./RoomDetailsSection";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RoomSwapDetailsDialog = ({
  selectedRequest,
  setSelectedRequest,
  isProcessing,
  setIsProcessing,
  notifications,
  setNotifications,
  userDetails,
  refreshData,
  setShowRejectionDialog,
  setRejectionReason,
  setReceiptData,
  setShowReceiptDialog,
  getStatusBadge,
}) => {
  if (!selectedRequest) return null;
  const [confirmType, setConfirmType] = useState<"accept" | "cancel" | null>(
    null
  );

  const handleAcceptReceived = async (id) => {
    setIsProcessing(true);
    try {
      const updatedNotifications = notifications.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            recipientAccepted: true,
            status: "approved",
            originalStatus: "accepted",
          };
        }
        return n;
      });

      setNotifications(updatedNotifications);

      toast({
        title: "Room Swap Accepted",
        description:
          "You've accepted the swap request. Your room assignment has been updated.",
      });

      setSelectedRequest(null);
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSent = async (id) => {
    setIsProcessing(true);
    try {
      await roomSwapAPI.cancelSwapRequest(id);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );

      setSelectedRequest(null);
      toast({
        title: "Request Cancelled",
        description: "Your room swap request has been successfully cancelled.",
      });

      refreshData();
    } catch (error) {
      console.error("Error canceling request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show rejection dialog for declining a swap request
  const showRejectDialog = (id) => {
    if (!selectedRequest || selectedRequest.id !== id) {
      const request = notifications.find((n) => n.id === id);
      setSelectedRequest(request);
    }
    setRejectionReason("");
    setShowRejectionDialog(true);
  };

  // Handle showing the receipt for an approved swap
  const handleShowReceipt = (request) => {
    const isRequester = request.requestType === "sent";

    const fromPerspective = isRequester
      ? {
          name: request.to === "You" ? userDetails.name : request.to,
          room: request.yourRoom,
          details: {
            blockName: request.requesterRoomObj?.blockName || "N/A",
            roomNumber: request.requesterRoomObj?.roomNumber || "N/A",
            floor: request.requesterRoomObj?.floor || "N/A",
            wing: request.requesterRoomObj?.wing || "N/A",
          },
        }
      : {
          name: request.to === "You" ? userDetails.name : request.to,
          room: request.yourRoom,
          details: {
            blockName: request.requestedRoomObj?.blockName || "N/A",
            roomNumber: request.requestedRoomObj?.roomNumber || "N/A",
            floor: request.requestedRoomObj?.floor || "N/A",
            wing: request.requestedRoomObj?.wing || "N/A",
          },
        };

    const toPerspective = isRequester
      ? {
          name: request.originalRequest?.recipient?.name,
          room: request.roomDetails,
          details: {
            blockName: request.requestedRoomObj?.blockName || "N/A",
            roomNumber: request.requestedRoomObj?.roomNumber || "N/A",
            floor: request.requestedRoomObj?.floor || "N/A",
            wing: request.requestedRoomObj?.wing || "N/A",
          },
        }
      : {
          name: request.from,
          room: request.roomDetails,
          details: {
            blockName: request.requesterRoomObj?.blockName || "N/A",
            roomNumber: request.requesterRoomObj?.roomNumber || "N/A",
            floor: request.requesterRoomObj?.floor || "N/A",
            wing: request.requesterRoomObj?.wing || "N/A",
          },
        };

    const receiptData = {
      id: request.id,
      swapId: `SWAP-${request.id.substring(0, 8).toUpperCase()}`,
      timestamp: request.timestamp,
      completionTimestamp: request.approvedAt || new Date().toISOString(),
      reason: request.reason,
      requester: fromPerspective,
      recipient: toPerspective,
      isRequester: isRequester,
    };

    setReceiptData(receiptData);
    setShowReceiptDialog(true);
  };

  return (
    <>
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-900 shadow-lg">
          <DialogHeader className="border-b border-purple-100 dark:border-purple-900 pb-4">
            <DialogTitle className="text-center font-bold text-xl text-purple-800 dark:text-purple-300">
              Room Swap Request Details
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <>
              <RoomDetailsSection selectedRequest={selectedRequest} />

              <DialogFooter className="flex-col sm:flex-row gap-2 mt-8 pt-4 border-t border-purple-100 dark:border-purple-900">
                {selectedRequest.status === "pending" && (
                  <>
                    {selectedRequest.requestType === "received" ? (
                      <>
                        <Button
                          onClick={() => setConfirmType("accept")}
                          disabled={isProcessing}
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md transition-all dark:bg-green-500 dark:hover:bg-green-600"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Accept Swap
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => showRejectDialog(selectedRequest.id)}
                          disabled={isProcessing}
                          className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-100 hover:border-red-600 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
                        >
                          <XSquare className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setConfirmType("cancel")}
                        disabled={isProcessing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-600 dark:hover:bg-red-700"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <XSquare className="h-4 w-4" />
                            <span>Cancel Request</span>
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                {selectedRequest?.status === "approved" && (
                  <Button
                    onClick={() => handleShowReceipt(selectedRequest)}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Receipt
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Unified Confirmation Dialog */}
      <AlertDialog
        open={confirmType !== null}
        onOpenChange={() => setConfirmType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="text-yellow-500" size={22} />
              {confirmType === "accept"
                ? "Accept Room Swap?"
                : "Cancel Request?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {confirmType === "accept"
                ? "Are you sure you want to accept this room request? Please ensure to check the room details carefully."
                : "Are you sure you want to cancel this room swap request? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center gap-1">
              <XCircle size={16} />
              {confirmType === "accept" ? "Cancel" : "No, Keep It"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmType === "accept") {
                  handleAcceptReceived(selectedRequest.id);
                } else if (confirmType === "cancel") {
                  handleCancelSent(selectedRequest.id);
                }
                setConfirmType(null);
              }}
              className="flex items-center gap-1"
            >
              <CheckCircle size={16} />
              {confirmType === "accept" ? "Accept" : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoomSwapDetailsDialog;
