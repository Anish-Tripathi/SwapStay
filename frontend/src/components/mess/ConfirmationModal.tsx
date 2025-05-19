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
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  isProcessing: boolean;
  processingText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  isProcessing,
  processingText = "Processing...",
  variant = "default",
}: ConfirmationModalProps) {
  const variantClasses = {
    default:
      "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800",
    destructive:
      "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isProcessing}
            className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className={variantClasses[variant]}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 dark:text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                {processingText}
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
