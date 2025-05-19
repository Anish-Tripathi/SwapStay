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
import { AlertCircle, Users, Loader2 } from "lucide-react";
import { ToggleAvailabilityDialogProps } from "./types/listroom";

export const ToggleAvailabilityDialog = ({
  open,
  onOpenChange,
  isAvailable,
  isUpdating,
  onConfirm,
}: ToggleAvailabilityDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {isAvailable ? (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            ) : (
              <Users className="h-5 w-5 text-green-500" />
            )}
            <AlertDialogTitle className="dark:text-white">
              {isAvailable ? "Mark as Unavailable?" : "Mark as Available?"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-zinc-600 dark:text-zinc-300">
            {isAvailable
              ? "This will prevent others from seeing your room for swap requests."
              : "This will make your room visible to others for swap requests."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isUpdating}
            className="dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isUpdating}
            className={`text-white ${
              isAvailable
                ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            }`}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            ) : isAvailable ? (
              "Make Unavailable"
            ) : (
              "Make Available"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
