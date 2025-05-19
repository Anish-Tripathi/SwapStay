import { useState } from "react";
import { UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const DeactivateAccountModal = ({ isAuthenticated, setIsAuthenticated }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const openDeactivateModal = () => {
    setShowDeactivateModal(true);
    setError("");
    setPassword("");
  };

  const closeDeactivateModal = () => {
    setShowDeactivateModal(false);
  };

  const handleDeactivateAccount = async () => {
    setError("");
    setIsProcessing(true);

    try {
      // Send request to deactivate account
      const response = await fetch(
        "http://localhost:5000/api/auth/deactivate-account",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to deactivate account");
      }

      // Clear local storage (same as logout)
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("roomSwapNotificationCount");
      localStorage.removeItem("roomSwapNotifications");

      setIsAuthenticated(false);
      closeDeactivateModal();

      // Show success message
      toast({
        title: "Account Deactivated",
        description: "Your account has been deactivated successfully.",
      });

      // Redirect to confirmation page
      navigate("/auth");
    } catch (error) {
      setError(error.message || "Failed to deactivate account");
      toast({
        variant: "destructive",
        title: "Deactivation Failed",
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="flex items-center w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={openDeactivateModal}
      >
        <UserX className="mr-2 h-4 w-4" />
        Deactivate Account
      </Button>

      {/* Modal Dialog */}
      <Dialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <UserX className="mr-2 h-5 w-5 text-red-500" />
              Deactivate Account
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
              Your account will be deactivated and hidden from other users. You
              can reactivate your account at any time by logging in.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Please enter your password to confirm:
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={closeDeactivateModal}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivateAccount}
              disabled={!password || isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {isProcessing ? "Processing..." : "Deactivate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeactivateAccountModal;
