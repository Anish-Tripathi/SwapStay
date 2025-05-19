import React from "react";
import { NavigateFunction } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRightCircleIcon,
  MessageCircleMore,
  InboxIcon,
} from "lucide-react";

interface ChatRedirectDialogProps {
  showChat: string | null;
  setShowChat: (roomId: string | null) => void;
  theme: string;
  navigate: NavigateFunction;
}

const ChatRedirectDialog: React.FC<ChatRedirectDialogProps> = ({
  showChat,
  setShowChat,
  theme,
  navigate,
}) => {
  return (
    <Dialog open={showChat !== null} onOpenChange={() => setShowChat(null)}>
      <DialogContent
        className={`sm:max-w-[450px] flex flex-col ${
          theme === "dark" ? "bg-slate-800 text-white border-slate-700" : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-xl ${
              theme === "dark" ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Chat Information
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 mb-5">
            <ArrowRightCircleIcon className="w-6 h-6 text-indigo-500 mt-1" />
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              You can send a swap request to the user by specifying your reason
              for the swap.
            </p>
          </div>

          <div className="flex items-start gap-3 mb-5">
            <MessageCircleMore className="w-6 h-6 text-teal-500 mt-1" />
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              After sending the request, continue the conversation with the room
              owner in the
              <strong> Request</strong> page under the <strong>Chat</strong>{" "}
              tab.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <InboxIcon className="w-6 h-6 text-pink-500 mt-1" />
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              All your conversations are organized in one place for easier
              communication.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setShowChat(null)}
            className={
              theme === "dark" ? "border-gray-600 text-purple-800" : ""
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowChat(null);
              navigate("/notifications");
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            Go to Chat Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatRedirectDialog;
