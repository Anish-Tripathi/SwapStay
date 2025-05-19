import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, AlertCircle, CheckCircle, Loader2, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (
    password: string,
    confirmPassword: string,
    token: string
  ) => Promise<void>;
  switchAuthMode: (mode: string) => void;
}

export const ResetPasswordForm = ({
  token,
  onSubmit,
  switchAuthMode,
}: ResetPasswordFormProps) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData.password, formData.confirmPassword, token);
      setSuccess(
        "Password has been reset successfully. You can now log in with your new password."
      );
      setFormData({ password: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-purple-400 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-center text-purple-900 dark:text-purple-300 text-2xl font-bold">
          <Lock className="h-6 w-6 inline mr-2" />
          Set New Password
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-400">
          Create a new password for your account
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="dark:text-gray-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
            disabled={
              isSubmitting || !formData.password || !formData.confirmPassword
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-0">
        {success && (
          <Button
            variant="outline"
            onClick={() => switchAuthMode("login")}
            className="mt-2 flex items-center"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Go to Login
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
