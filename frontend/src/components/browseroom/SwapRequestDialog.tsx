import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";
import { Room, SwapRequestDialogProps } from "./types/about";

const SwapRequestDialog: React.FC<SwapRequestDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roomDetails,
  swapReason,
  setSwapReason,
  isLoading,
  priority,
  setPriority,
}) => {
  const { theme } = useTheme();

  if (!roomDetails) return null;

  // Only render the Dialog when isOpen is true
  if (!isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`sm:max-w-[600px] max-h-[90vh] overflow-y-auto ${
          theme === "dark"
            ? "bg-gradient-to-b from-purple-900 to-slate-900 text-white border-slate-700"
            : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-2xl text-center ${
              theme === "dark" ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Request Room Swap
          </DialogTitle>
          <DialogDescription
            className={`text-center ${theme === "dark" ? "text-gray-400" : ""}`}
          >
            Send a swap request to {roomDetails.owner.name} for their room in{" "}
            {roomDetails.blockName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                } mb-2`}
              >
                Room Details
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-700">{roomDetails.sharing}</Badge>
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {roomDetails.blockName} - Room {roomDetails.roomNumber}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant="outline"
                  className={
                    theme === "dark" ? "border-gray-600 text-gray-300" : ""
                  }
                >
                  {roomDetails.blockType}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    theme === "dark" ? "border-gray-600 text-gray-300" : ""
                  }
                >
                  Floor {roomDetails.floor}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    theme === "dark" ? "border-gray-600 text-gray-300" : ""
                  }
                >
                  Wing {roomDetails.wing}
                </Badge>
              </div>
            </div>

            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg mb-4`}
            >
              <Label
                className={`text-sm font-medium mb-2 block ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Request Priority
              </Label>

              <RadioGroup
                value={priority}
                onValueChange={setPriority}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label
                    htmlFor="low"
                    className="cursor-pointer text-green-600 dark:text-green-400"
                  >
                    Low - Not urgent, can wait
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer">
                    Normal - Standard request
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label
                    htmlFor="high"
                    className="cursor-pointer text-red-600 dark:text-red-400"
                  >
                    High - Urgent need to swap
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div
              className={`${
                theme === "dark" ? "bg-slate-700" : "bg-purple-50"
              } p-3 rounded-lg`}
            >
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-purple-300" : "text-purple-900"
                } mb-2`}
              >
                Reason for Swap Request
              </h4>
              <Textarea
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
                placeholder="Explain why you'd like to swap rooms..."
                className={`min-h-24 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className={`sm:flex-1 ${
              theme === "dark"
                ? "border-gray-600 text-black hover:bg-slate-700 hover:text-white"
                : "text-black"
            }`}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !swapReason.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white sm:flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapRequestDialog;
