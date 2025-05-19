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
import { Trash2, Loader2 } from "lucide-react";

interface DeleteListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  onConfirm: () => void;
}

export const DeleteListingDialog = ({
  open,
  onOpenChange,
  isDeleting,
  onConfirm,
}: DeleteListingDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white text-black dark:bg-gray-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500 " />
            <AlertDialogTitle className="dark:text-white">
              Delete Room Listing?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
            This action cannot be undone. This will permanently delete your room
            listing and remove it from the swap system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete Listing"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
