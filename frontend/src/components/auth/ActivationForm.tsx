import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  KeyRound,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authAPI } from "../../services/emailApi";

interface OTPResponse {
  success: boolean;
  message?: string;
}

interface VerifyOTPResponse {
  success: boolean;
  token: string;
  user: Record<string, any>;
}

const ActivationForm = ({ switchAuthMode }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsRequestingOTP(true);

    try {
      const response = await authAPI.sendReactivationOTP(email);
      const data = response.data as OTPResponse;

      if (data.success) {
        setOtpSent(true);
        setSuccess("Activation code has been sent to your email.");
      }
    } catch (err) {
      console.error("Send OTP Error Details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send activation code. Please check your email and try again."
      );
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await authAPI.verifyReactivationOTP(
        email,
        activationCode
      );
      const data = response.data as VerifyOTPResponse;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Account Reactivated!",
          description: "Redirecting to login page...",
          duration: 2000,
          className: "bg-white text-purple-600 border border-purple-200",
        });

        setTimeout(() => {
          window.location.href = "/auth?mode=login";
        }, 2000);
      }
    } catch (err) {
      console.error("Verify OTP Error Details:", err);

      toast({
        title: "Verification Failed",
        description:
          err.response?.data?.message ||
          "Failed to verify activation code. Please try again.",
        variant: "destructive",
        duration: 5000,
      });

      setError(
        err.response?.data?.message ||
          "Failed to verify activation code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setIsRequestingOTP(true);

    try {
      const response = await authAPI.sendReactivationOTP(email);
      const data = response.data as OTPResponse;

      if (data.success) {
        setSuccess("Activation code has been resent to your email.");
      }
    } catch (err) {
      console.error("Resend OTP Error Details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to resend activation code. Please try again later."
      );
    } finally {
      setIsRequestingOTP(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-purple-400 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-center text-purple-900 dark:text-purple-300 text-2xl font-bold">
          <RefreshCw className="h-6 w-6 inline mr-2" />
          {otpSent ? "Verify Activation Code" : "Reactivate Account"}
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-400">
          {otpSent
            ? "Enter the activation code sent to your email"
            : "Enter your email to receive an activation code"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {!otpSent ? (
          // Email Form
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
              disabled={isRequestingOTP || !email}
            >
              {isRequestingOTP ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Activation Code"
              )}
            </Button>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="email"
                  value={email}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activationCode" className="dark:text-gray-300">
                Activation Code
              </Label>
              <div className="relative">
                <KeyRound className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="activationCode"
                  placeholder="Enter your activation code"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
              disabled={isSubmitting || !activationCode}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Reactivate"
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-0">
        {otpSent && (
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
              disabled={isRequestingOTP}
            >
              {isRequestingOTP ? (
                <>
                  <Loader2 className="inline mr-1 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        )}

        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          {otpSent ? (
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
            >
              <ArrowLeft className="h-3 w-3 inline mr-1" />
              Change Email
            </button>
          ) : (
            "Remember your account details?"
          )}{" "}
          <button
            type="button"
            onClick={() => switchAuthMode("login")}
            className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
          >
            Back to Login
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivationForm;
