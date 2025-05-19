import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onRejectionReasonChange: (reason: string) => void;
  onReject: () => void;
  isProcessing: boolean;
}

export function RejectionDialog({
  open,
  onOpenChange,
  rejectionReason,
  onRejectionReasonChange,
  onReject,
  isProcessing,
}: RejectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Room Swap Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request. This will be
            shared with the requester.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectionReason}
            onChange={(e) => onRejectionReasonChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              "Reject Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
